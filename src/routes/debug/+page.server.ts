import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";

import type { Actions, RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}

	// const repos = await fetch(`https://api.github.com/users/${event.locals.user.username}/repos`);
	const repos = await fetch(`https://api.github.com/users/sveltejs/repos`);
	const reposJson = await repos.json();

	return {
		user: event.locals.user,
		repos: reposJson
	};
}