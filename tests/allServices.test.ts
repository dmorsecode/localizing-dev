import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import {
    addRequestedLanguageToRequest,
    getRequestedLanguagesByRequestId,
    deleteRequestedLanguageFromRequest,
    deleteAllRequestedLanguagesFromRequest
} from '$lib/server/services/languageService';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { setupDb, teardownDb, testDb } from './db.setup';


describe('Language Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    // Helper to create a dummy request (needed for foreign key)
    const createRequest = async () => {
        const [request] = await db
            .insert(schema.requests)
            .values({
                requestor_id: userId, // Make sure this user exists or mock it
                repo_url: 'https://github.com/example/repo',
            })
            .returning();
        return request;
    };

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        await db.execute(sql`TRUNCATE TABLE "languages", "requests", "user" RESTART IDENTITY CASCADE;`);

        // Insert user so that request.requestor_id has a valid FK
        await db.insert(schema.user).values({
            id: userId,
            githubId: githubId,
            username: 'languser',
            avatar: 'https://example.com/avatar.png'
        });

        // Insert the request that languages will reference
        await db.insert(schema.requests).values({
            r_id: requestId,
            requestor_id: userId,
            repo_url: 'https://github.com/example/repo',
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should add a language to a request', async () => {
        const request = await createRequest();
        await addRequestedLanguageToRequest(request.r_id, 'English');

        const langs = await getRequestedLanguagesByRequestId(request.r_id);
        expect(langs).toHaveLength(1);
        expect(langs[0].language).toBe('English');
    });

    it('should get all languages for a request', async () => {
        const request = await createRequest();
        await addRequestedLanguageToRequest(request.r_id, 'javascript');
        await addRequestedLanguageToRequest(request.r_id, 'typescript');

        const langs = await getRequestedLanguagesByRequestId(request.r_id);
        expect(langs).toHaveLength(2);
        const langNames = langs.map((l) => l.language);
        expect(langNames).toContain('javascript');
        expect(langNames).toContain('typescript');
    });

    it('should delete a specific language from a request', async () => {
        await addRequestedLanguageToRequest(requestId, 'typescript');
        const beforeDelete = await getRequestedLanguagesByRequestId(requestId);
        expect(beforeDelete).toHaveLength(1);

        await deleteRequestedLanguageFromRequest(requestId, 'typescript');
        const afterDelete = await getRequestedLanguagesByRequestId(requestId);
        expect(afterDelete).toHaveLength(0);
    });

    it('should delete all languages for a request', async () => {
        await addRequestedLanguageToRequest(requestId, 'typescript');
        await addRequestedLanguageToRequest(requestId, 'javascript');
        const beforeDelete = await getRequestedLanguagesByRequestId(requestId);
        expect(beforeDelete).toHaveLength(2);

        await deleteAllRequestedLanguagesFromRequest(requestId);
        const afterDelete = await getRequestedLanguagesByRequestId(requestId);
        expect(afterDelete).toHaveLength(0);
    });
});


import {
    createLeaderboardEntry,
    getLeaderboardEntryByUserId,
    getFullLeaderboard,
    updateLeaderboardScore,
    incrementLeaderboardScore,
    deactivateLeaderboardEntry,
    deleteLeaderboardEntry
} from '$lib/server/services/leaderboardService';


describe('Leaderboard Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
      TRUNCATE TABLE "leaderboard", "user" RESTART IDENTITY CASCADE;
    `);

        // Insert a dummy user for FK reference
        await db.insert(schema.user).values({
            id: userId,
            githubId: githubId,
            username: 'leaderuser',
            avatar: 'https://avatar.url'
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should create a leaderboard entry for a user', async () => {
        const [entry] = await createLeaderboardEntry(userId, 100, true);
        expect(entry.user_id).toBe(userId);
        expect(entry.l_score).toBe(100);
        expect(entry.is_active).toBe(true);
    });

    it('should get leaderboard entry by user ID', async () => {
        const [created] = await createLeaderboardEntry(userId, 80);
        const entry = await getLeaderboardEntryByUserId(userId);
        expect(entry?.user_id).toBe(userId);
        expect(entry?.l_score).toBe(80);
    });

    it('should get full leaderboard sorted by score', async () => {
        await createLeaderboardEntry(userId, 50);

        await db.insert(schema.user).values({
            id: 'user2',
            githubId: 88888,
            username: 'user2',
            avatar: 'https://avatar2.url'
        });

        await createLeaderboardEntry('user2', 150);

        const leaderboard = await getFullLeaderboard();
        expect(leaderboard).toHaveLength(2);
        expect(leaderboard[0].l_score!).toBeGreaterThanOrEqual(leaderboard[1].l_score!);
    });

    it('should update a user leaderboard score', async () => {
        await createLeaderboardEntry(userId, 10);
        const [updated] = await updateLeaderboardScore(userId, 999);
        expect(updated.l_score).toBe(999);
    });

    it('should increment a user leaderboard score', async () => {
        await createLeaderboardEntry(userId, 20);
        const result = await incrementLeaderboardScore(userId, 5);
      
        expect(result).not.toBeNull();
      
        const [updated] = result!;
        expect(updated.l_score).toBe(25);
      });
      

    it('should return null when incrementing score for nonexistent entry', async () => {
        const result = await incrementLeaderboardScore('nonexistent-user-id', 10);
        expect(result).toBeNull();
    });

    it('should deactivate a leaderboard entry', async () => {
        await createLeaderboardEntry(userId, 10);
        const [updated] = await deactivateLeaderboardEntry(userId);
        expect(updated.is_active).toBe(false);
    });

    it('should delete a leaderboard entry', async () => {
        await createLeaderboardEntry(userId, 10);
        await deleteLeaderboardEntry(userId);

        const entry = await getLeaderboardEntryByUserId(userId);
        expect(entry).toBeNull();
    });
});


import {
    createNotification,
    getNotificationById,
    getNotificationsByUserId,
    getUnreadNotificationsByUserId,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotificationsByUserId
} from '$lib/server/services/notificationService';

describe('Notification Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
      TRUNCATE TABLE "notifications", "user" RESTART IDENTITY CASCADE;
    `);

        // Insert a dummy user for foreign key
        await db.insert(schema.user).values({
            id: userId,
            githubId: githubId,
            username: 'notiuser',
            avatar: 'https://avatar.example.com'
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should create a new notification', async () => {
        const [notification] = await createNotification({
            user_id: userId,
            message: 'You have a new message',
            type: 'info'
        });

        expect(notification.user_id).toBe(userId);
        expect(notification.message).toBe('You have a new message');
        expect(notification.type).toBe('info');
        expect(notification.is_read).toBe(0);
    });

    it('should get a notification by ID', async () => {
        const [created] = await createNotification({
            user_id: userId,
            message: 'Check this out'
        });

        const found = await getNotificationById(created.n_id);
        expect(found?.n_id).toBe(created.n_id);
        expect(found?.message).toBe('Check this out');
    });

    it('should get all notifications for a user', async () => {
        await createNotification({ user_id: userId, message: 'Notif 1' });
        await createNotification({ user_id: userId, message: 'Notif 2' });

        const notifications = await getNotificationsByUserId(userId);
        expect(notifications).toHaveLength(2);
    });

    it('should get unread notifications only', async () => {
        const [n1] = await createNotification({ user_id: userId, message: 'Unread' });
        const [n2] = await createNotification({ user_id: userId, message: 'Also unread' });

        await markNotificationAsRead(n1.n_id);

        const unread = await getUnreadNotificationsByUserId(userId);
        expect(unread).toHaveLength(1);
        expect(unread[0].n_id).toBe(n2.n_id);
    });

    it('should mark a notification as read', async () => {
        // Insert the user that the notification will reference
        await db.insert(schema.user).values({
            id: 'notified-user-id',
            githubId: 9999,
            username: 'notifieduser',
            avatar: 'https://example.com/avatar.png'
        });

        // Create the notification using the service
        const [notification] = await createNotification({
            user_id: 'notified-user-id',
            message: 'Hello, this is a test notification',
            type: 'info'
        });

        // Mark as read
        const [updated] = await markNotificationAsRead(notification.n_id);
        expect(updated.is_read).toBe(1);
    });

    it('should mark all notifications as read for a user', async () => {
        await createNotification({ user_id: userId, message: 'One' });
        await createNotification({ user_id: userId, message: 'Two' });

        await markAllNotificationsAsRead(userId);
        const all = await getNotificationsByUserId(userId);
        all.forEach((n) => expect(n.is_read).toBe(1));
    });

    it('should delete a notification by ID', async () => {
        const [notif] = await createNotification({ user_id: userId, message: 'Delete me' });
        await deleteNotification(notif.n_id);

        const result = await getNotificationById(notif.n_id);
        expect(result).toBeNull();
    });

    it('should delete all notifications for a user', async () => {
        await createNotification({ user_id: userId, message: 'One' });
        await createNotification({ user_id: userId, message: 'Two' });

        await deleteAllNotificationsByUserId(userId);
        const all = await getNotificationsByUserId(userId);
        expect(all).toHaveLength(0);
    });
});


import {
    createRequest,
    getRequestById,
    getRequestsByUser,
    updateRequest,
    deleteRequest
} from '$lib/server/services/requestService';

describe('Request Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
      TRUNCATE TABLE "requests", "user" RESTART IDENTITY CASCADE;
    `);

        // Insert a dummy user for foreign key
        await db.insert(schema.user).values({
            id: userId,
            githubId: githubId,
            username: 'requestuser',
            avatar: 'https://avatar.example.com'
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should create a new request', async () => {
        const [request] = await createRequest({
            requestor_id: userId,
            repo_url: 'https://github.com/example/repo',
        });

        expect(request.requestor_id).toBe(userId);
        expect(request.repo_url).toBe('https://github.com/example/repo');
        expect(request.status).toBe('open');
    });

    it('should return request with associated tags and requested languages', async () => {
        const [request] = await createRequest({
          requestor_id: userId,
          repo_url: 'https://github.com/example/repo',
        });
      
        await db.insert(schema.tags).values([
          { request_id: request.r_id, tag: 'api' },
          { request_id: request.r_id, tag: 'auth' }
        ]);
      
        await db.insert(schema.languages).values([
          { request_id: request.r_id, language: 'french' },
          { request_id: request.r_id, language: 'spanish' }
        ]);
      
        const result = await getRequestById(request.r_id);
      
        expect(result).not.toBeNull();
        if (!result) throw new Error('Expected result to be defined but got null');
        
        expect(result.r_id).toBe(request.r_id);
        expect(result.requestor_id).toBe(userId);
        expect(result.repo_url).toBe('https://github.com/example/repo');
        expect(result.status).toBe('open');
      
        expect(Array.isArray(result.tags)).toBe(true);
        expect(result.tags.length).toBe(2);
        expect(result.tags).toContain('api');
        expect(result.tags).toContain('auth');
      
        expect(Array.isArray(result.requested_languages)).toBe(true);
        expect(result?.requested_languages.length).toBe(2);
        expect(result?.requested_languages).toContain('french');
        expect(result?.requested_languages).toContain('spanish');
      
        //console.log(JSON.stringify(result, null, 2));
      });
    
    it('should return all requests with associated tags and requested languages', async () => {
        const [request1] = await createRequest({
          requestor_id: userId,
          repo_url: 'https://github.com/example/repo1',
        });
    
        const [request2] = await createRequest({
          requestor_id: userId,
          repo_url: 'https://github.com/example/repo2',
        });
    
        await db.insert(schema.tags).values([
          { request_id: request1.r_id, tag: 'api' },
          { request_id: request1.r_id, tag: 'auth' },
          { request_id: request2.r_id, tag: 'backend' }
        ]);
        
        await db.insert(schema.languages).values([
          { request_id: request1.r_id, language: 'french' },
          { request_id: request1.r_id, language: 'spanish' },
          { request_id: request2.r_id, language: 'japanese' }
        ]);
    
        const result = await getRequestsByUser(userId);
    
        expect(result).not.toBeNull();
        if (!result) throw new Error('Expected result to be defined but got null');
    
        const r1 = result.find((r) => r.r_id === request1.r_id);
        const r2 = result.find((r) => r.r_id === request2.r_id);
    
        // Assert request 1
        expect(r1).toBeDefined();
        expect(r1?.requestor_id).toBe(userId);
        expect(r1?.repo_url).toBe('https://github.com/example/repo1');
        expect(r1?.status).toBe('open');
        expect(Array.isArray(r1?.tags)).toBe(true);
        expect(r1?.tags).toContain('api');
        expect(r1?.tags).toContain('auth');
        expect(Array.isArray(r1?.requested_languages)).toBe(true);
        expect(r1?.requested_languages).toContain('french');
        expect(r1?.requested_languages).toContain('spanish');
    
        // Assert request 2
        expect(r2).toBeDefined();
        expect(r2?.requestor_id).toBe(userId);
        expect(r2?.repo_url).toBe('https://github.com/example/repo2');
        expect(r2?.status).toBe('open');
        expect(Array.isArray(r2?.tags)).toBe(true);
        expect(r2?.tags).toContain('backend');
        expect(Array.isArray(r2?.requested_languages)).toBe(true);
        expect(r2?.requested_languages).toContain('japanese');
    
        //console.log(JSON.stringify(result, null, 2));
      });


    it('should update a request', async () => {
        const [request] = await createRequest({
            requestor_id: userId,
            repo_url: 'https://github.com/repo/update-me',
        });

        const [updated] = await updateRequest(request.r_id, {
            status: 'closed',
        });

        expect(updated.status).toBe('closed');
    });

    it('should delete a request', async () => {
        const [request] = await createRequest({
            requestor_id: userId,
            repo_url: 'https://github.com/repo/delete-me',
        });

        await deleteRequest(request.r_id);

        const result = await getRequestById(request.r_id);

        //console.log(JSON.stringify(result, null, 2));

        expect(result).toBeNull();

    });
});


import {
    createReview,
    getReviewById,
    getReviewsBySubmissionId,
    getReviewsByReviewerId,
    updateReview,
    deleteReview
} from '$lib/server/services/reviewService';

describe('Review Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
  let translatorId: string = crypto.randomUUID(); // ensure unique PK
  let submissionId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
      TRUNCATE TABLE "reviews", "submission", "requests", "user" RESTART IDENTITY CASCADE;
    `);

        // Insert dummy user and request
        await db.insert(schema.user).values({
            id: userId,
            githubId: githubId,
            username: 'reviewer',
            avatar: 'https://avatar.example.com'
        });

        await db.insert(schema.user).values({
            id: translatorId,
            githubId: 67890,
            username: 'translator',
            avatar: 'https://avatar.example.com'
        });

        await db.insert(schema.requests).values({
            r_id: requestId,
            requestor_id: userId,
            repo_url: 'https://github.com/example/repo',
        });

        await db.insert(schema.submission).values({
            s_id: submissionId,
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/1'
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should create a review', async () => {
        const [review] = await createReview({
            submission_id: submissionId,
            reviewer_id: userId,
            rating: 4,
            comments: 'Great work!'
        });

        expect(review.submission_id).toBe(submissionId);
        expect(review.reviewer_id).toBe(userId);
        expect(review.rating).toBe(4);
        expect(review.comments).toBe('Great work!');
    });

    it('should get a review by ID', async () => {
        const [created] = await createReview({
            submission_id: submissionId,
            reviewer_id: userId,
            rating: 5,
            comments: 'Perfect'
        });

        const review = await getReviewById(created.rv_id);
        expect(review?.rv_id).toBe(created.rv_id);
        expect(review?.rating).toBe(5);
        expect(review?.comments).toBe('Perfect');
    });

    it('should get all reviews for a submission', async () => {
        await createReview({ submission_id: submissionId, reviewer_id: userId, rating: 3 });
        await createReview({ submission_id: submissionId, reviewer_id: userId, rating: 4 });

        const reviews = await getReviewsBySubmissionId(submissionId);
        expect(reviews).toHaveLength(2);
    });

    it('should get all reviews by reviewer', async () => {
        await createReview({ submission_id: submissionId, reviewer_id: userId, rating: 2 });
        await createReview({ submission_id: submissionId, reviewer_id: userId, rating: 5 });

        const reviews = await getReviewsByReviewerId(userId);
        expect(reviews).toHaveLength(2);
    });

    it('should update a review', async () => {
        const [created] = await createReview({
            submission_id: submissionId,
            reviewer_id: userId,
            rating: 1,
            comments: 'Needs improvement'
        });

        const [updated] = await updateReview(created.rv_id, {
            rating: 4,
            comments: 'Better now'
        });

        expect(updated.rating).toBe(4);
        expect(updated.comments).toBe('Better now');
    });

    it('should delete a review', async () => {
        const [created] = await createReview({
            submission_id: submissionId,
            reviewer_id: userId,
            rating: 3
        });

        await deleteReview(created.rv_id);
        const result = await getReviewById(created.rv_id);
        expect(result).toBeNull();
    });
});


import {
    createSession,
    getSessionById,
    getSessionsByUserId,
    deleteSessionById,
    deleteAllSessionsByUserId,
    deleteExpiredSessions
} from '$lib/server/services/sessionService';


describe('Session Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
      TRUNCATE TABLE "session", "user" RESTART IDENTITY CASCADE;
    `);

        // Insert dummy user for FK reference
        await db.insert(schema.user).values({
            id: userId,
            githubId: githubId,
            username: 'sessionuser',
            avatar: 'https://avatar.example.com'
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should create a session', async () => {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        const [session] = await createSession(userId, expiresAt);

        expect(session.userId).toBe(userId);
        expect(new Date(session.expiresAt).getTime()).toBe(expiresAt.getTime());
    });

    it('should get session by ID', async () => {
        const expiresAt = new Date(Date.now() + 3600000);
        const [session] = await createSession(userId, expiresAt);

        const found = await getSessionById(session.id);
        expect(found?.id).toBe(session.id);
        expect(found?.userId).toBe(userId);
    });

    it('should get all sessions for a user', async () => {
        const expiresAt = new Date(Date.now() + 3600000);
        await createSession(userId, expiresAt);
        await createSession(userId, expiresAt);

        const sessions = await getSessionsByUserId(userId);
        expect(sessions).toHaveLength(2);
    });

    it('should delete a session by ID', async () => {
        const expiresAt = new Date(Date.now() + 3600000);
        const [session] = await createSession(userId, expiresAt);

        await deleteSessionById(session.id);
        const result = await getSessionById(session.id);
        expect(result).toBeNull();
    });

    it('should delete all sessions for a user', async () => {
        const expiresAt = new Date(Date.now() + 3600000);
        await createSession(userId, expiresAt);
        await createSession(userId, expiresAt);

        await deleteAllSessionsByUserId(userId);
        const sessions = await getSessionsByUserId(userId);
        expect(sessions).toHaveLength(0);
    });

    it('should delete expired sessions only', async () => {
        const expired = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
        const valid = new Date(Date.now() + 1000 * 60 * 60); // 1 hour later

        await createSession(userId, expired);
        await createSession(userId, valid);

        await deleteExpiredSessions();
        const sessions = await getSessionsByUserId(userId);
        expect(sessions).toHaveLength(1);
        expect(new Date(sessions[0].expiresAt).getTime()).toBe(valid.getTime());
    });
});


import {
    createSubmission,
    getSubmissionById,
    getSubmissionsByRequestId,
    getSubmissionsByTranslatorId,
    updateSubmission,
    deleteSubmission
} from '$lib/server/services/submissionService';

describe('Submission Service', () => {3
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let translatorId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK

    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
      TRUNCATE TABLE "submission", "requests", "user" RESTART IDENTITY CASCADE;
    `);

        // Insert dummy translator and requestor users
        await db.insert(schema.user).values([
            {
                id: translatorId,
                githubId: githubId,
                username: 'translator',
                avatar: 'https://avatar.example.com'
            },
            {
                id: userId,
                githubId: 2002,
                username: 'requestor',
                avatar: 'https://avatar.example.com'
            }
        ]);

        // Insert dummy request
        await db.insert(schema.requests).values({
            r_id: requestId,
            requestor_id: userId,
            repo_url: 'https://github.com/example/repo',
        });
    });

    afterAll(async () => {
        await teardownDb();
    });

    it('should create a submission', async () => {
        const [submission] = await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/1'
        });

        expect(submission.request_id).toBe(requestId);
        expect(submission.translator_id).toBe(translatorId);
        expect(submission.pull_url).toBe('https://github.com/example/repo/pull/1');
        expect(submission.status).toBe('on review');
    });

    it('should get submission by ID', async () => {
        const [created] = await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/2'
        });

        const result = await getSubmissionById(created.s_id);
        expect(result?.s_id).toBe(created.s_id);
        expect(result?.pull_url).toBe('https://github.com/example/repo/pull/2');
    });

    it('should get all submissions for a request', async () => {
        await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/1'
        });

        await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/2'
        });

        const submissions = await getSubmissionsByRequestId(requestId);
        expect(submissions).toHaveLength(2);
    });

    it('should get all submissions by translator', async () => {
        await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/1'
        });

        await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/2'
        });

        const submissions = await getSubmissionsByTranslatorId(translatorId);
        expect(submissions).toHaveLength(2);
    });

    it('should update a submission', async () => {
        const [created] = await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/1',
            status: 'on review'
        });

        const [updated] = await updateSubmission(created.s_id, {
            status: 'approved',
            pull_url: 'https://github.com/example/repo/pull/updated'
        });

        expect(updated.status).toBe('approved');
        expect(updated.pull_url).toBe('https://github.com/example/repo/pull/updated');
    });

    it('should delete a submission', async () => {
        const [created] = await createSubmission({
            request_id: requestId,
            translator_id: translatorId,
            pull_url: 'https://github.com/example/repo/pull/1'
        });

        await deleteSubmission(created.s_id);
        const result = await getSubmissionById(created.s_id);
        expect(result).toBeNull();
    });
});


import {
    addTagToRequest,
    addTagsToRequest,
    getTagsByRequestId,
    deleteTagFromRequest,
    deleteAllTagsFromRequest,
    deleteTagsFromRequest
} from '$lib/server/services/tagService';

describe('Tag Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK
    
    beforeAll(async () => {
        await setupDb();
    });

    beforeEach(async () => {
        // Clean the tables before each test
        await db.execute(sql`
          TRUNCATE TABLE "tags", "requests", "user" RESTART IDENTITY CASCADE;
        `);
      
        // Now safe to insert again
        await db.insert(schema.user).values({
          id: userId,
          githubId: githubId,
          username: 'testuser',
          avatar: 'https://example.com/avatar.png'
        });
      
        await db.insert(schema.requests).values({
          r_id: requestId,
          requestor_id: userId,
          repo_url: 'https://github.com/example/repo',
        });
      });
      

    afterAll(async () => {
        await teardownDb();
    });

    it('should add a single tag to a request', async () => {
        await addTagToRequest(requestId, 'frontend');
        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(1);
        expect(tags[0].tag).toBe('frontend');
    });

    it('should add multiple tags to a request', async () => {
        await addTagsToRequest(requestId, ['frontend', 'backend', 'devops']);
        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(3);
        const tagNames = tags.map((t) => t.tag);
        expect(tagNames).toContain('frontend');
        expect(tagNames).toContain('backend');
        expect(tagNames).toContain('devops');
    });

    it('should return empty array when adding no tags (bulk insert)', async () => {
        const result = await addTagsToRequest(requestId, []);
        expect(result).toEqual([]);
    });

    it('should get all tags for a request', async () => {
        await addTagsToRequest(requestId, ['typescript', 'react']);
        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(2);
    });

    it('should delete a specific tag from a request', async () => {
        await addTagsToRequest(requestId, ['ts', 'js']);
        await deleteTagFromRequest(requestId, 'ts');
        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(1);
        expect(tags[0].tag).toBe('js');
    });

    it('should delete all tags for a request', async () => {
        await addTagsToRequest(requestId, ['ts', 'js', 'css']);
        await deleteAllTagsFromRequest(requestId);
        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(0);
    });

    it('should delete multiple specific tags from a request', async () => {
        await addTagsToRequest(requestId, ['api', 'auth', 'ui', 'ux']);
        await deleteTagsFromRequest(requestId, ['api', 'ux']);

        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(2);
        const tagList = tags.map((t) => t.tag);
        expect(tagList).toContain('auth');
        expect(tagList).toContain('ui');
    });

    it('should do nothing if deleting tags with empty list', async () => {
        await addTagsToRequest(requestId, ['ts', 'graphql']);
        await deleteTagsFromRequest(requestId, []);
        const tags = await getTagsByRequestId(requestId);
        expect(tags).toHaveLength(2);
    });
});


import {
    createUser,
    getUserFromGitHubId,
    getUserByUsername,
    getUserByEmail,
    updateUser,
    deleteUser
} from '$lib/server/services/userService';

describe('User Service', () => {
    let requestId: string = crypto.randomUUID(); // ensure unique PK
    let userId: string = crypto.randomUUID(); // ensure unique PK
    let githubId: number = Math.floor(Math.random() * 1_000_000_000); // ensure unique PK
    
	beforeAll(async () => {
		await setupDb();
	});

	beforeEach(async () => {
		// Clean the tables before each test
		await db.execute(sql`
      TRUNCATE TABLE "user", "leaderboard" RESTART IDENTITY CASCADE;
    `);
	});

	afterAll(async () => {
		await teardownDb();
	});

	it('should create a user and add them to leaderboard', async () => {
		const user = await createUser(12345, 'test@example.com', 'testuser', 'https://avatar.url');

		expect(user).toBeDefined();
		expect(user.githubId).toBe(12345);
		expect(user.username).toBe('testuser');
		expect(user.email).toBe('test@example.com');
		expect(user.avatar).toBe('https://avatar.url');
	});

	it('should get user by GitHub ID', async () => {
		const user = await createUser(11111, null, 'ghuser', 'https://avatar.url');
		const found = await getUserFromGitHubId(11111);

		expect(found).not.toBeNull();
		expect(found?.id).toBe(user.id);
	});

	it('should get user by username', async () => {
		const user = await createUser(22222, null, 'username123', 'https://avatar.url');
		const found = await getUserByUsername('username123');

		expect(found).not.toBeNull();
		expect(found?.id).toBe(user.id);
	});

	//it('should get user by email', async () => {
		//const user = await createUser(33333, 'user@email.com', 'emailuser', 'https://avatar.url');
		//const found = await getUserByEmail('user@email.com');

		//expect(found).not.toBeNull();
		//expect(found?.id).toBe(user.id);
	//});

	it('should update user fields', async () => {
		const user = await createUser(44444, 'old@email.com', 'olduser', 'https://avatar.old');
		const updated = await updateUser(user.id, {
			email: 'new@email.com',
			avatar: 'https://avatar.new'
		});

		expect(updated?.email).toBe('new@email.com');
		expect(updated?.avatar).toBe('https://avatar.new');
	});

	it('should delete user by ID', async () => {
        const user = await createUser(55555, null, 'deluser', 'https://avatar.url');
    
        // Clean up leaderboard entry using service
        await deleteLeaderboardEntry(user.id);
    
        await deleteUser(user.id);
    
        const result = await getUserFromGitHubId(55555);
        expect(result).toBeNull();
    });
    
});

