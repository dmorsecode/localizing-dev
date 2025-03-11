import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";

import type { Actions, RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
	const repos = await fetch(`https://api.github.com/users/${event.locals.user?.username}/repos`);
	const reposJson = await repos.json();

	return {
		// user: event.locals.user,
		repos: reposJson
	};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	if (event.locals.session === null) {
		return fail(401);
	}
	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, "/login");
}