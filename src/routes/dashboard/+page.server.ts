import { fail, error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types.js';
import { fail } from "@sveltejs/kit";
import type { Actions, RequestEvent } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { requestFormSchema } from "$lib/components/forms/repo-request-form/schema";
import { submissionFormSchema } from "$lib/components/forms/submission-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { addRequestedLanguageToRequest } from '$lib/server/services/languageService';
import { addCurrentLanguageToRequest } from '$lib/server/services/curr_languageService';
import { createRequest, getRequestsByUser, getRequestByRepoUrl } from '$lib/server/services/requestService';
import { addTagsToRequest } from '$lib/server/services/tagService';
import { getSubmissionsByTranslatorId, createSubmission } from '$lib/server/services/submissionService';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";


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
	const submissions = await getSubmissionsByTranslatorId(event.locals.user.id);

	return {
		requestForm: await superValidate(zod(requestFormSchema)),
		submissionForm: await superValidate(zod(submissionFormSchema)),
		requests: await requests,
		submissions: await submissions,
		repos: await repos.json()
		repos: await repos
	};
}

export const actions: Actions = {
	request: addRepo,
	submission: submitSubmission
};

async function submitSubmission(event: RequestEvent) {
	const form = await superValidate(event, zod(submissionFormSchema));
	const url = new URL(form.data.url);

	if (url.hostname !== "github.com") {
		return fail(400, {
			form,
		});
	}

	const repoUrl = url.href.split("/").slice(0, 5).join("/");
	const request = await getRequestByRepoUrl(repoUrl);
	if (request ===  null) {
		return fail(400, {
			form,
		});
	}

	const repoOwner = url.pathname.split("/")[1];
	const repoName = url.pathname.split("/")[2];
	const pullNumber = url.pathname.split("/")[4];
	const pullData = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`);

	const pull = await pullData.json();
	const isMerged = pull.merged;

	// if (pull.user.login !== event.locals.user?.username || pull.author_association === "OWNER") {
	// 	return fail(400, {
	// 		form,
	// 	});
	// }

	const submissionObject = {
		translator_id: event.locals.user?.id,
		request_id: request.r_id,
		pull_url: form.data.url,
		status: isMerged ? "merged" : "on review",
	}
	await createSubmission(submissionObject);

	return {
		form
	};
}

async function addRepo(event: RequestEvent) {
	const form = await superValidate(event, zod(requestFormSchema));
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
