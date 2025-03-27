import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

// Create a user
export async function createUser(
    githubId: number,
    email: string | null,
    username: string,
    avatar: string
) {
    const [createdUser] = await db.transaction(async (tx) => {
        const insertedUsers = await tx.insert(schema.user)
        .values({ githubId, email, username, avatar})
        .returning();

        const newUser = insertedUsers[0];

        await tx.insert(schema.leaderboard)
        .values({ user_id: newUser.id, l_score: 0})
        .returning();

        return [newUser];
    })

    return createdUser;
}

//Get user by GitHubId
export async function getUserFromGitHubId(githubId: number) {
    const row = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.githubId, githubId))
      .limit(1);
  
    return row[0] ?? null;
  }

//Get user by Username
export async function getUserByUsername(username: string) {
    const row = await db.select()
      .from(schema.user)
      .where(eq(schema.user.username, username))
      .limit(1);
  
    return row[0] ?? null;
  }

  //Get user by Email Address
  export async function getUserByEmail(email: string) {
    const row = await db.select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);
  
    return row[0] ?? null;
  }

  //Update User
  export async function updateUser(userId: string, updates: Partial<typeof schema.user.$inferInsert>) {
    const updated = await db.update(schema.user)
      .set(updates)
      .where(eq(schema.user.id, userId))
      .returning();
  
    return updated[0] ?? null;
  }

  //Delete a user
  export async function deleteUser(userId: string) {
    return await db
      .delete(schema.user)
      .where(eq(schema.user.id, userId));
  }