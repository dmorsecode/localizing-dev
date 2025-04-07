import { fail, error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { requestFormSchema } from "$lib/components/forms/repo-request-form/schema";
import { submissionFormSchema } from "$lib/components/forms/submission-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { addRequestedLanguageToRequest } from '$lib/server/services/languageService';
import { addCurrentLanguageToRequest } from '$lib/server/services/curr_languageService';
import { createRequest, getRequestsByUser, getRequestByRepoUrl } from '$lib/server/services/requestService';
import { getBookmarksForUser } from '$lib/server/services/bookmarkService';
import { addTagsToRequest } from '$lib/server/services/tagService';
import { getSubmissionsByTranslatorId, createSubmission } from '$lib/server/services/submissionService';
import { isUserIdOnLeaderboard, createLeaderboardEntry, incrementLeaderboardScore, getLeaderboardEntryByUserId } from '$lib/server/services/leaderboardService';
import { fetchDiffData, fetchRepoData } from '$lib/server/github/apiServices';


export async function load(event: RequestEvent) {
	if (event.locals.user === null) return;

	const githubToken = event.locals.session?.githubToken;
	if (!githubToken) throw error(401, 'Missing GitHub token');

	// TODO: Use githubService.
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
	const bookmarks = await getBookmarksForUser(event.locals.user.id, true);
	const leaderboardScore = await getLeaderboardEntryByUserId(event.locals.user.id);

	return {
		requestForm: await superValidate(zod(requestFormSchema)),
		submissionForm: await superValidate(zod(submissionFormSchema)),
		requests: await requests,
		submissions: await submissions,
		bookmarks: await bookmarks,
		repos: await repos,
		leaderboardScore: await leaderboardScore
	};
}

export const actions: Actions = {
	request: addRepo,
	submission: submitSubmission
};

async function submitSubmission(event: RequestEvent) {
	if (event.locals.user == null) {
		return fail(401, {
			message: "Unauthorized."
		});
	}

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

	const githubToken = event.locals.session?.githubToken;
	if (!githubToken) throw error(401, 'Missing GitHub token');

	const repoOwner = url.pathname.split("/")[1];
	const repoName = url.pathname.split("/")[2];
	const pullNumber = url.pathname.split("/")[4];
	// TODO: Use githubService.
	const pullData = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
		headers: {
			Authorization: `Bearer ${githubToken}`,
			Accept: 'application/vnd.github+json'
		}
	});

	const pull = await pullData.json();
	const isMerged = pull.merged;

	// if (pull.user.login !== event.locals.user?.username || pull.author_association === "OWNER") {
	// 	return fail(400, {
	// 		form,
	// 	});
	// }

	const diff = await fetchDiffData(url.pathname.substring(1), githubToken);
	// Split diff by newlines, count the byte size of every line that starts with a +. Basic algorithm for how many leaderboard points the diff is worth.
	const diffLines = diff.split("\n").filter(line => line.startsWith("+"));
	const diffSize = Math.floor(diffLines.reduce((acc, line) => acc + new Blob([line]).size, 0) / 10); // Divided by 10 to combat point inflation.

	const submissionObject = {
		translator_id: event.locals.user!.id,
		request_id: request.r_id,
		pull_url: form.data.url,
		provided_language: form.data.providedLanguage,
		earned_points: diffSize ?? 0,
		status: isMerged ? "merged" : "on review",
	}
	await createSubmission(submissionObject);

	if (!isMerged) return {
		form
	};

	const onLeaderboard = await isUserIdOnLeaderboard(event.locals.user.id);

	if (onLeaderboard) {
		await incrementLeaderboardScore(event.locals.user.id, diffSize);
	} else {
		await createLeaderboardEntry(event.locals.user.id, diffSize)
			.then(() => {
				incrementLeaderboardScore(event.locals.user!.id, diffSize);
			});
	}

	return {
		form
	};
}

async function addRepo(event: RequestEvent) {
	const form = await superValidate(event, zod(requestFormSchema));
	const url = new URL(form.data.url);

	const repoData = await fetchRepoData(url.pathname.substring(1), event.locals.session?.githubToken ?? null);

	if (url.hostname !== 'github.com' || repoData.owner.login.toLowerCase() !== event.locals.user!.username.toLowerCase()) {
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
		requestor_id: event.locals.user!.id,
		repo_url: form.data.url,
		status: 'open',
		description: form.data.description,
		kb_size: repoData.size,
		star_size: repoData.stargazers_count,
		license: repoData.license?.key ?? null,
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
