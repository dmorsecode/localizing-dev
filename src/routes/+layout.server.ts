import type { RequestEvent } from "./$types";

export async function load(event: RequestEvent) {
	if (event.locals.session === null || event.locals.user === null) {
		return;
	}

	return {
		user: event.locals.user,
	};
}