import { fail } from "@sveltejs/kit";
import type { Actions, RequestEvent } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "$lib/components/forms/repo-submission-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { createRequest, getRequestsByUser } from '$lib/server/services/requestService';
import { addLanguageToRequest } from '$lib/server/services/languageService';
import { addTagsToRequest } from '$lib/server/services/tagService';

export async function load(event: RequestEvent) {
	if (event.locals.user === null) return;
	const repos = await fetch(`https://api.github.com/users/${event.locals.user.username}/repos`);
	const requests = await getRequestsByUser(event.locals.user.id);

	return {
		form: await superValidate(zod(formSchema)),
		requests: await requests,
		repos: await repos.json()
	};
}

export const actions: Actions = {
	default: addRepo,
};

async function addRepo(event: RequestEvent) {
	const form = await superValidate(event, zod(formSchema));
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

	console.log(event.locals.user.id);
	const requestObject = {
		requestor_id: event.locals.user.id,
		repo_url: form.data.url,
		current_language: form.data.currentLangs[0],
		status: 'open'
	}
	const reqResponse = await createRequest(requestObject);
	for (let i = 0; i < form.data.requestedLangs.length; i++) {
		await addLanguageToRequest(reqResponse[0].r_id, form.data.requestedLangs[i]);
	}
	addTagsToRequest(reqResponse[0].r_id, form.data.tags);


	return {
		form,
	};
}