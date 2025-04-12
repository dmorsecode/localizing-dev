import { json } from '@sveltejs/kit';
import { getSubmissionByPullUrl, updateSubmission } from '$lib/server/services/submissionService';
import { incrementLeaderboardScore, isUserIdOnLeaderboard, createLeaderboardEntry } from '$lib/server/services/leaderboardService';
import { fetchDiffData } from '$lib/server/github/apiServices';
import { validateSessionToken } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';


export async function GET({ url, cookies }: RequestEvent) {
	const token = cookies.get('auth-session');
	const path = url.searchParams.get('path');
	if (!path) return new Response('Missing path', { status: 400 });

	const merged = url.searchParams.get('merged') === 'false' ? false : true;
	const { session } = await validateSessionToken(token ?? '');

	try {
		const data = await getSubmissionByPullUrl(path);
		if (data.status !== "merged" && merged) {
			const updatedSubmission = await updateSubmission(data.s_id, { status: 'merged' });
			const diffData = session?.githubToken ? await fetchDiffData(path.split('.com/')[1], session.githubToken) : await fetchDiffData(path.split('.com/')[1], null);
			const diffLines = diffData.split("\n").filter(line => line.startsWith("+"));
			const diffSize = Math.floor(diffLines.reduce((acc, line) => acc + new Blob([line]).size, 0) / 10);
			const onLeaderboard = await isUserIdOnLeaderboard(data.translator_id);
			if (onLeaderboard) {
				await incrementLeaderboardScore(data.translator_id, diffSize);
			} else {
				await createLeaderboardEntry(data.translator_id, diffSize)
					.then(() => {
						incrementLeaderboardScore(data.translator_id, diffSize);
					});
			}
			return json(updatedSubmission);
		}
		return json(data);
	} catch (err) {
		console.error(`GitHub API failed for ${path}:`, err);
		return new Response('GitHub error', { status: 500 });
	}
}
