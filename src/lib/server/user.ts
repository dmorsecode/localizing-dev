import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export async function getUserFromGitHubId(githubId: number) {
	const row = await db.select().from(user).where(eq(user.githubId, githubId)).limit(1);
	if (!row) return null;
	return row[0];
}

export async function createUser(githubId: number, email: string | null, username: string, avatar: string) {
	const newUser = { githubId, email, username, avatar };
	return db.insert(user).values(newUser).returning().then((rows) => rows[0]);
}