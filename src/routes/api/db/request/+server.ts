import { json } from '@sveltejs/kit';
import { getRequestByRepoUrl } from '$lib/server/services/requestService';
import type { RequestEvent } from '@sveltejs/kit';


export async function GET({ url }: RequestEvent) {
	const path = url.searchParams.get('path');
	if (!path) return new Response('Missing path', { status: 400 });

	try {
		const data = await getRequestByRepoUrl(path);
		return json(data);
	} catch (err) {
		console.error(`GitHub API failed for ${path}:`, err);
		return new Response('GitHub error', { status: 500 });
	}
}
