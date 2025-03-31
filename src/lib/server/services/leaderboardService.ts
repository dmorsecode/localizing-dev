import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create a leaderboard entry for a user
export const createLeaderboardEntry = async (user_id: string, l_score = 0, is_active = true) => {
  return await db.insert(schema.leaderboard).values({
    user_id,
    l_score,
    is_active
  }).returning();
};

// Check whether a user has a leaderboard entry, optionally checking whether it's active
export const isUserIdOnLeaderboard = async (user_id: string) => {
  const rows = await db
    .select()
    .from(schema.leaderboard)
    .where(eq(schema.leaderboard.user_id, user_id))
    .limit(1);

  return rows.length > 0;
}

//Get a leaderboard entry by user ID
export const getLeaderboardEntryByUserId = async (user_id: string) => {
    const rows = await db
      .select()
      .from(schema.leaderboard)
      .where(eq(schema.leaderboard.user_id, user_id))
      .limit(1);
  
    return rows[0] ?? null; // ← ensure null, not undefined
  };
  

//Get full leaderboard (sorted by score descending)
export const getFullLeaderboard = async () => {
  return await db
    .select()
    .from(schema.leaderboard)
    .where(eq(schema.leaderboard.is_active, true))
    .orderBy(desc(schema.leaderboard.l_score));
};

//Update a user's leaderboard score
export const updateLeaderboardScore = async (user_id: string, newScore: number) => {
  return await db
    .update(schema.leaderboard)
    .set({ l_score: newScore })
    .where(eq(schema.leaderboard.user_id, user_id))
    .returning();
};

//Increment a user's leaderboard score
export const incrementLeaderboardScore = async (user_id: string, incrementBy: number = 1) => {
    const currentEntry = await getLeaderboardEntryByUserId(user_id);
    if (!currentEntry) return null;

  
    const newScore = (currentEntry.l_score ?? 0) + incrementBy;
    return await updateLeaderboardScore(user_id, newScore);
};

//Deactivate a user's leaderboard entry
export const deactivateLeaderboardEntry = async (user_id: string) => {
  return await db
    .update(schema.leaderboard)
    .set({ is_active: false })
    .where(eq(schema.leaderboard.user_id, user_id))
    .returning();
};

//Delete a leaderboard entry
export const deleteLeaderboardEntry = async (user_id: string) => {
  return await db
    .delete(schema.leaderboard)
    .where(eq(schema.leaderboard.user_id, user_id));
};
