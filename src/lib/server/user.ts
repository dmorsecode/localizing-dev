import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user, leaderboard } from '$lib/server/db/schema';

export async function getUserFromGitHubId(githubId: number) {
	const row = await db.select().from(user).where(eq(user.githubId, githubId)).limit(1);
	if (!row) return null;
	return row[0];
}

export async function createUser(
	githubId: number,
	email: string | null,
	username: string,
	avatar: string
) {
	const [createdUser] = await db.transaction(async (tx) => {
		const insertedUsers = await tx.insert(user)
		.values({ githubId, email, username, avatar})
		.returning();

		const newUser = insertedUsers[0];

		await tx.insert(leaderboard)
		.values({ user_id: newUser.id, l_score: 0})
		.returning();

		return [newUser];
	})

	return createdUser;
}