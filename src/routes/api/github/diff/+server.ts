import { json } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth';
import { fetchDiffData } from '$lib/server/github/apiServices';
import type { RequestEvent } from '@sveltejs/kit';


export async function GET({ url, cookies }: RequestEvent) {
	const token = cookies.get('auth-session');
	const { session } = await validateSessionToken(token ?? '');

	const path = url.searchParams.get('path');
	if (!path) return new Response('Missing path', { status: 400 });

	try {
		const data = session?.githubToken ? await fetchDiffData(path, session.githubToken) : await fetchDiffData(path, null);
		return json(data);
	} catch (err) {
		console.error(`GitHub API failed for ${path}:`, err);
		return new Response('GitHub error', { status: 500 });
	}
}
