import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '../src/lib/server/db/schema';
import { db } from '../src/lib/server/db/index';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { sql } from 'drizzle-orm';
import { setupDb, teardownDb, testDb } from './db.setup';


//const TEST_DB_URL = env.DATABASE_URL || 'postgres://localhost:5432/test_db';

// Setup test database client
//const testClient = postgres(TEST_DB_URL);
//const testDb = drizzle(testClient, { schema });

describe('Database Operations', () => {
  beforeAll(async () => {   

    await setupDb();

    // //Test database connection first
    // const result = await testDb.execute(sql`SELECT 1 as result`);
    // if (result[0]?.result !== 1) {
    //   throw new Error('❌ Failed to establish database connection!');
    // }

    // // Run migrations before all tests
    // await migrate(testDb, { migrationsFolder: './drizzle', mode: 'reset' });

  });

  beforeEach(async () => {
    // Clean database before each test
    await testDb.execute(sql`
      TRUNCATE TABLE "user", "session", "requests", "submission", 
      "reviews", "notifications", "leaderboard", "languages", "tags" 
      RESTART IDENTITY CASCADE;
    `);
  });

  afterAll(async () => {
    // Cleanup after all tests
    //await testClient.end();
    await teardownDb();
  });

  //TEST: User Operations
  describe('User Operations', () => {
    it('should create a new user', async () => {
      const newUser = {
        githubId: 12345,
        username: 'testuser',
        avatar: 'https://example.com/avatar.jpg'
      };

      await testDb.insert(schema.user).values(newUser);

      const users = await testDb.select().from(schema.user);
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({
        githubId: 12345,
        username: 'testuser',
        avatar: 'https://example.com/avatar.jpg',
        total_requests: 0,
        total_submissions: 0,
        points: 0
      });
    });

    it('should read user by githubId', async () => {
      await testDb.insert(schema.user).values({
        githubId: 67890,
        username: 'readtest',
        avatar: 'https://example.com/avatar2.jpg'
      });

      const result = await testDb
        .select()
        .from(schema.user)
        .where(eq(schema.user.githubId, 67890));

      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('readtest');
    });

    it('should not allow duplicate githubId', async () => {
        const newUser = {
            githubId: 12345,
            username: 'testuser2',
            avatar: 'https://example.com/avatar.jpg'
        };
    
        await testDb.insert(schema.user).values(newUser);
    
        await expect(testDb.insert(schema.user).values(newUser)).rejects.toThrow();
    });

    it('should fetch user by email', async () => {
        const email = 'test@example.com';
    
        await testDb.insert(schema.user).values({
            githubId: 98765,
            email,
            username: 'emailuser',
            avatar: 'https://example.com/avatar.jpg'
        });
    
        const users = await testDb
            .select()
            .from(schema.user)
            .where(eq(schema.user.email, email));
    
        expect(users).toHaveLength(1);
        expect(users[0].email).toBe(email);
    });
    
  });

  //TEST: Request Operations
  describe('Request Operations', () => {
    it('should create a request with a user', async () => {
      // First create a user
      const [createdUser] = await testDb.insert(schema.user).values({
        githubId: 11111,
        username: 'requestor',
        avatar: 'https://example.com/avatar3.jpg'
      }).returning();

      // Create a request
      const newRequest = {
        requestor_id: createdUser.id,
        repo_url: 'https://github.com/test/repo',
        current_language: 'javascript',
        status: 'open'
      };

      await testDb.insert(schema.requests).values(newRequest);

      const requests = await testDb
        .select()
        .from(schema.requests)
        .where(eq(schema.requests.requestor_id, createdUser.id));

      expect(requests).toHaveLength(1);
      expect(requests[0]).toMatchObject({
        repo_url: 'https://github.com/test/repo',
        current_language: 'javascript',
        status: 'open',
        requestor_id: createdUser.id
      });
    });

    it('should not allow creating a request with non-existent requestor_id', async () => {
        const request = {
            requestor_id: 'non-existent-id',
            repo_url: 'https://github.com/test/repo3',
            current_language: 'ruby'
        };
    
        await expect(testDb.insert(schema.requests).values(request)).rejects.toThrow();
    });    

  });

  //TEST: Submission Operations
  describe('Submission Operations', () => {
    it('should create a submission linked to a request and user', async () => {
      // Create user
      const [user] = await testDb.insert(schema.user).values({
        githubId: 22222,
        username: 'translator',
        avatar: 'https://example.com/avatar4.jpg'
      }).returning();

      // Create request
      const [request] = await testDb.insert(schema.requests).values({
        requestor_id: user.id,
        repo_url: 'https://github.com/test/repo2',
        current_language: 'python'
      }).returning();

      // Create submission
      const newSubmission = {
        request_id: request.r_id,
        translator_id: user.id,
        pull_url: 'https://github.com/test/repo2/pull/1'
      };

      await testDb.insert(schema.submission).values(newSubmission);

      const submissions = await testDb
        .select()
        .from(schema.submission)
        .where(eq(schema.submission.request_id, request.r_id));

      expect(submissions).toHaveLength(1);
      expect(submissions[0]).toMatchObject({
        request_id: request.r_id,
        translator_id: user.id,
        pull_url: 'https://github.com/test/repo2/pull/1',
        status: 'on review'
      });
    });

    it('should not allow submissions to non-existent requests', async () => {
        const submission = {
            request_id: 'non-existent-request',
            translator_id: 'some-user-id',
            pull_url: 'https://github.com/test/repo3/pull/1'
        };
    
        await expect(testDb.insert(schema.submission).values(submission)).rejects.toThrow();
    });

    it('should not allow submissions by a non-existent translator', async () => {
        // Step 1: Create a valid user
        const [validUser] = await testDb.insert(schema.user).values({
            githubId: 1234567,
            username: 'validuser',
            avatar: 'https://example.com/avatar.jpg'
        }).returning();
    
        // Step 2: Create a valid request using that user
        const [validRequest] = await testDb.insert(schema.requests).values({
            requestor_id: validUser.id,  // Ensures a valid requestor_id
            repo_url: 'https://github.com/test/repo',
            current_language: 'typescript'
        }).returning();
    
        // Step 3: Try inserting a submission with a non-existent translator_id
        const invalidTranslatorId = 'non-existent-id';
    
        const submission = {
            request_id: validRequest.r_id, // Valid request ID
            translator_id: invalidTranslatorId, // Invalid translator ID
            pull_url: 'https://github.com/test/repo/pull/1'
        };
    
        await expect(testDb.insert(schema.submission).values(submission)).rejects.toThrow();
    });
        
  });

  //TEST: Review Operations
  describe('Review Operations', () => {
    it('should not allow reviews for non-existent submissions', async () => {
        const review = {
            submission_id: 'non-existent-submission',
            reviewer_id: 'some-user-id',
            rating: 5,
            comments: 'Great job!'
        };
    
        await expect(testDb.insert(schema.reviews).values(review)).rejects.toThrow();
    });

    it('should create and fetch a review', async () => {
        const [user] = await testDb.insert(schema.user).values({
            githubId: 54321,
            username: 'reviewer',
            avatar: 'https://example.com/avatar5.jpg'
        }).returning();
    
        const [request] = await testDb.insert(schema.requests).values({
            requestor_id: user.id,
            repo_url: 'https://github.com/test/repo5',
            current_language: 'csharp'
        }).returning();
    
        const [submission] = await testDb.insert(schema.submission).values({
            request_id: request.r_id,
            translator_id: user.id,
            pull_url: 'https://github.com/test/repo5/pull/1'
        }).returning();
    
        await testDb.insert(schema.reviews).values({
            submission_id: submission.s_id,
            reviewer_id: user.id,
            rating: 4,
            comments: 'Looks good!',
        });
    
        const reviews = await testDb
            .select()
            .from(schema.reviews)
            .where(eq(schema.reviews.submission_id, submission.s_id));
    
        expect(reviews).toHaveLength(1);
        expect(reviews[0].rating).toBe(4);
        expect(reviews[0].comments).toBe('Looks good!');
    });
        
  });

  //TEST: Notification Operations
  describe('Notifications Operations', () => {
    it('should create a notification and mark it as read', async () => {
        const [user] = await testDb.insert(schema.user).values({
            githubId: 65432,
            username: 'notifieduser',
            avatar: 'https://example.com/avatar6.jpg'
        }).returning();
    
        const [notification] = await testDb.insert(schema.notifications).values({
            user_id: user.id,
            message: 'You have a new request!',
            is_read: 0
        }).returning();
    
        expect(notification.is_read).toBe(0);
    
        await testDb
            .update(schema.notifications)
            .set({ is_read: 1 })
            .where(eq(schema.notifications.n_id, notification.n_id));
    
        const updatedNotification = await testDb
            .select()
            .from(schema.notifications)
            .where(eq(schema.notifications.n_id, notification.n_id));
    
        expect(updatedNotification[0].is_read).toBe(1);
    });
    
        
  });
});