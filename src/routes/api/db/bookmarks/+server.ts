import { json } from '@sveltejs/kit';
import { createBookmark, deleteBookmark, getBookmarksForUser } from '$lib/server/services/bookmarkService';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ locals } : RequestEvent) {
	if (!locals.user?.id) return new Response('Unauthorized', { status: 401 });

	try {
		const bookmarks = await getBookmarksForUser(locals.user.id);
		// if (bookmarks == null || bookmarks.length === 0) return new Response('No bookmarks found', { status: 200 });
		return json(bookmarks, { status: 200 });
	} catch (err) {
		console.error(`DB API failed to get bookmarks:`, err);
		return new Response('Database error', { status: 500 });
	}
}

export async function POST({ locals, request } : RequestEvent) {
	const { request_id } = await request.json();
	console.log(`Request ID: ${request_id}`);

	if (!request_id) return new Response('Missing request_id', { status: 400 });
	if (!locals.user?.id) return new Response('Unauthorized', { status: 401 });

	try {
		const data = await createBookmark({user_id: locals.user.id, request_id});
		if (data.length === 0) return new Response('Bookmark not created', { status: 500 });
		return new Response('Bookmark created', { status: 200 });
	} catch (err) {
		console.error(`DB API failed to create bookmark:`, err);
		return new Response('Database error', { status: 500 });
	}
}

export async function DELETE({ locals, request } : RequestEvent) {
	const { request_id } = await request.json();
	console.log(`Request ID: ${request_id}`);

	if (!request_id) return new Response('Missing request_id', { status: 400 });
	if (!locals.user?.id) return new Response('Unauthorized', { status: 401 });

	try {
		const data = await deleteBookmark(locals.user.id, request_id);
		if (data.length === 0) return new Response('Bookmark not deleted', { status: 500 });
		return new Response('Bookmark deleted', { status: 200 });
	} catch (err) {
		console.error(`DB API failed to delete bookmark:`, err);
		return new Response('Database error', { status: 500 });
	}
}