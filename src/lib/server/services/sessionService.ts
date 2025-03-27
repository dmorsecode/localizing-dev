import { eq, lt } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create a session
export const createSession = async (userId: string, expiresAt: Date) => {
  return await db.insert(schema.session).values({
    userId,
    expiresAt
  }).returning();
};

//Get a session by session ID
export const getSessionById = async (sessionId: string) => {
  const rows = await db
    .select()
    .from(schema.session)
    .where(eq(schema.session.id, sessionId))
    .limit(1);

  return rows[0] ?? null;
};

//Get all sessions for a user
export const getSessionsByUserId = async (userId: string) => {
  return await db
    .select()
    .from(schema.session)
    .where(eq(schema.session.userId, userId));
};

//Delete a session by session ID
export const deleteSessionById = async (sessionId: string) => {
  return await db
    .delete(schema.session)
    .where(eq(schema.session.id, sessionId));
};

//Delete all sessions for a user (optional, e.g. logout all devices)
export const deleteAllSessionsByUserId = async (userId: string) => {
  return await db
    .delete(schema.session)
    .where(eq(schema.session.userId, userId));
};

//Cleanup expired sessions
export const deleteExpiredSessions = async () => {
  return await db
    .delete(schema.session)
    .where(lt(schema.session.expiresAt, new Date()));
};
