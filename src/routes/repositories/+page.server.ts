import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from "./$types.js";
import { getAllRequests } from '$lib/server/services/requestService';
import { superValidate } from "sveltekit-superforms";
import { searchFilterFormSchema } from "$lib/components/forms/search-filter-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import * as serviceTypes from '$lib/server/services/serviceTypes';

export async function load({ url }) {
	const page = url.searchParams.get('page');
	const perPage = url.searchParams.get('perPage');
	const requestedLanguage = url.searchParams.get('requestedLanguage');
	const repoName = url.searchParams.get('repoName');
	const originalLanguage = url.searchParams.get('originalLanguage');
	const minStars = url.searchParams.get('minStars');
	const maxStars = url.searchParams.get('maxStars');
	const minKb = url.searchParams.get('minKb');
	const maxKb = url.searchParams.get('maxKb');
	const license = url.searchParams.get('license');
	const tags = url.searchParams.get('tags');

	const requestOptions : serviceTypes.GetRepositoriesOptions = {
		page: page ? parseInt(page) : 1,
		perPage: perPage ? parseInt(perPage) : 8,
		repoName: repoName ? repoName : null,
		requestedLanguage: requestedLanguage ? [requestedLanguage] : null,
		originalLanguage: originalLanguage ? [originalLanguage] : null,
		minStar: minStars ? parseInt(minStars) : null,
		maxStar: maxStars ? parseInt(maxStars) : null,
		minKb: minKb ? parseInt(minKb) : null,
		maxKb: maxKb ? parseInt(maxKb) : null,
		licenseType: license ? license : null,
		tags: tags ? tags.split(',') : null
	};

	const repos = await getAllRequests(requestOptions);

	return {
		repos: await repos,
		searchForm: await superValidate(zod(searchFilterFormSchema)),
		currentPage: url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 1,
		perPage: url.searchParams.get('perPage') ? parseInt(url.searchParams.get('perPage')!) : 8,
		totalPages: await repos?.totalPages
	};
}

export const actions: Actions = {
	default: applyFilters,
};


async function applyFilters(event: RequestEvent) {
	const form = await superValidate(event, zod(searchFilterFormSchema));
	if (!form.valid) {
		return fail(400, {
			form
		});
	}


	const tags = form.data.tags ? form.data.tags.join(',') : null;

	const url = new URL(event.request.url);
	url.search = '';
	const params = new URLSearchParams(url.search);
	form.data.repoName ? params.set('repoName', form.data.repoName.toString()) : params.delete('repoName');
	form.data.currentLang ? params.set('originalLanguage', form.data.currentLang.toString()) : params.delete('originalLanguage');
	form.data.requestedLang ? params.set('requestedLanguage', form.data.requestedLang.toString()) : params.delete('requestedLanguage');
	form.data.minStars ? params.set('minStars', form.data.minStars.toString()) : params.delete('minStars');
	form.data.maxStars ? params.set('maxStars', form.data.maxStars.toString()) : params.delete('maxStars');
	form.data.minKb ? params.set('minKb', form.data.minKb.toString()) : params.delete('minKb');
	form.data.maxKb ? params.set('maxKb', form.data.maxKb.toString()) : params.delete('maxKb');
	form.data.license ? params.set('license', form.data.license.toString()) : params.delete('license');
	tags ? params.set('tags', tags) : params.delete('tags');

	return redirect(303, `/repositories?${params}`);
}
