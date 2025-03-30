import { fail, error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/components/forms/repo-submission-form/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { createRequest, getRequestsByUser } from '$lib/server/services/requestService';
import { addRequestedLanguageToRequest } from '$lib/server/services/languageService';
import { addCurrentLanguageToRequest } from '$lib/server/services/curr_languageService';
import { addTagsToRequest } from '$lib/server/services/tagService';


export async function load(event: RequestEvent) {
	if (event.locals.user === null) return;

	//const repos = await fetch(`https://api.github.com/users/${event.locals.user.username}/repos`);

	const githubToken = event.locals.session?.githubToken;
	if (!githubToken) throw error(401, 'Missing GitHub token');

	const reposRes = await fetch(`https://api.github.com/users/${event.locals.user.username}/repos`, {
		headers: {
			Authorization: `Bearer ${githubToken}`,
			Accept: 'application/vnd.github+json'
		}
	});

	if (!reposRes.ok) {
		console.error(`GitHub error ${reposRes.status}:`, await reposRes.text());
		throw error(reposRes.status, 'Failed to fetch GitHub repos');
	}

	const repos = await reposRes.json();

	const requests = await getRequestsByUser(event.locals.user.id);

	return {
		form: await superValidate(zod(formSchema)),
		requests: await requests,
		repos: await repos
	};
}

export const actions: Actions = {
	default: addRepo
};

async function addRepo(event: RequestEvent) {
	const form = await superValidate(event, zod(formSchema));
	const url = new URL(form.data.url);
	if (url.hostname !== 'github.com' || url.pathname.split('/')[1] !== event.locals.user?.username) {
		return fail(400, {
			form
		});
	}

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	console.log(event.locals.user.id);
	const requestObject = {
		requestor_id: event.locals.user.id,
		repo_url: form.data.url,
		status: 'open',
		description: form.data.description
	};
	const reqResponse = await createRequest(requestObject);
	for (let i = 0; i < form.data.currentLangs.length; i++) {
		await addCurrentLanguageToRequest(reqResponse[0].r_id, form.data.currentLangs[i]);
	}
	for (let i = 0; i < form.data.requestedLangs.length; i++) {
		await addRequestedLanguageToRequest(reqResponse[0].r_id, form.data.requestedLangs[i]);
	}
	addTagsToRequest(reqResponse[0].r_id, form.data.tags);

	return {
		form
	};
}
