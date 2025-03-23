import { getAllRequests } from '$lib/server/services/requestService';
import { getLanguagesByRequestId } from '$lib/server/services/languageService';
import { getTagsByRequestId } from '$lib/server/services/tagService';

export async function load() {
	const requests : FullRequest[] = await getAllRequests();
	for (let i = 0; i < requests.length; i++) {
		const request = requests[i];
		const languages = await getLanguagesByRequestId(request.r_id);
		const tags = await getTagsByRequestId(request.r_id);
		request.requested_languages = languages;
		request.tags = tags;
	}

	return {
		repos: requests
	};
}