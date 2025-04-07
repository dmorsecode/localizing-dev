import { getAllRequests, getJoinedRequestById } from '$lib/server/services/requestService';
import { superValidate } from "sveltekit-superforms";
import { searchFilterFormSchema } from "$lib/components/forms/search-filter-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import * as serviceTypes from '$lib/server/services/serviceTypes';

export async function load() {
	const requestOptions : serviceTypes.GetRepositoriesOptions = {
		page: 1,
		perPage: 10,
		requestedLanguage: "cy"
	};

	return {
		repos: await getAllRequests(requestOptions),
		searchForm: await superValidate(zod(searchFilterFormSchema))
	};
}