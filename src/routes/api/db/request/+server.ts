import { json } from '@sveltejs/kit';
import { getRequestByRepoUrl, deleteRequest } from '$lib/server/services/requestService';
import { deleteBookmarksForRequest } from '$lib/server/services/bookmarkService';
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

export async function DELETE({ locals, request } : RequestEvent) {
	const { request_id } = await request.json();

	if (!request_id) return new Response('Missing request_id', { status: 400 });
	if (!locals.user?.id) return new Response('Unauthorized', { status: 401 });
	
	try {
		await deleteBookmarksForRequest(request_id).then(async res => {
			const req = await deleteRequest(request_id);
			if (req.length === 0) return new Response('Request not deleted', { status: 500 });
			return new Response('Request deleted', { status: 200 });
		});
		return new Response('Request deleted', { status: 200 });
	} catch (err) {
		console.error(`DB API failed to delete request:`, err);
		return new Response('Database error', { status: 500 });
	}
}