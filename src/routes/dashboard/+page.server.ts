import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth";
import type { Actions, RequestEvent } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "$lib/components/forms/repo-submission-form/schema";
import { zod } from "sveltekit-superforms/adapters";

export async function load(event: RequestEvent) {
	const repos = await fetch(`https://api.github.com/users/${event.locals.user?.username}/repos`);
	const reposJson = await repos.json();

	return {
		form: await superValidate(zod(formSchema)),
		repos: reposJson
	};
}

export const actions: Actions = {
	default: addRepo,
};

async function addRepo(event: RequestEvent) {
	const form = await superValidate(event, zod(formSchema));
	console.log(form);
	const url = new URL(form.data.url);
	if (url.hostname !== "github.com" || url.pathname.split("/")[1] !== event.locals.user?.username) {
		return fail(400, {
			form,
		});
	}

	if (!form.valid) {
		return fail(400, {
			form,
		});
	}

	// TODO: Save data to the database.

	return {
		form,
	};
}