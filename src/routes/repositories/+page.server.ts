import { getAllRequests } from '$lib/server/services/requestService';
import { superValidate } from "sveltekit-superforms";
import { searchFilterFormSchema } from "$lib/components/forms/search-filter-form/schema";
import { zod } from "sveltekit-superforms/adapters";

export async function load() {
	const repos = await getAllRequests();
	if (!repos) return;

	console.log(repos);

	return {
		repos: await getAllRequests(),
		searchForm: await superValidate(zod(searchFilterFormSchema))
	};
}