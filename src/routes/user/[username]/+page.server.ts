import { fail, error } from '@sveltejs/kit';
import type { RequestEvent } from "./$types.js";
import { getRequestsByUser, getRequestByRepoUrl } from '$lib/server/services/requestService';
import { getSubmissionsByTranslatorId } from '$lib/server/services/submissionService';
import { getLeaderboardEntryByUserId } from '$lib/server/services/leaderboardService';
import { getUserByUsername } from '$lib/server/services/userService';

export async function load({ params }: RequestEvent) {
	const username = await getUserByUsername(params.username);
	if (!username) {
		throw error(404, 'User not found!');
	}
	const userProfile = await getUserByUsername(params.username);
	if (!userProfile) {
		throw error(404, 'User not found!');
	}

	const leaderboardScore = await getLeaderboardEntryByUserId(userProfile.id);
	if (!leaderboardScore || !leaderboardScore.is_active) {
		throw error(404, 'User not found!');
	}

	const requests = await getRequestsByUser(userProfile.id);
	const submissions = await getSubmissionsByTranslatorId(userProfile.id);

	return {
		userProfile: await userProfile,
		requests: await requests,
		submissions: await submissions,
		leaderboardScore: await leaderboardScore
	};
}