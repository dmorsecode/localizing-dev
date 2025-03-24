import { getAllRequests } from '$lib/server/services/requestService';

export async function load() {
	return {
		repos: await getAllRequests()
	};
}