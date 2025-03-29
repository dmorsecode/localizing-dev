import type { RequestEvent } from "./$types";
import { getUserFromGitHubId } from '$lib/server/services/userService';

export async function load(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return;
	}

	const user = await getUserFromGitHubId(event.locals.user.githubId);
	return {
		user: await user,
	};
}