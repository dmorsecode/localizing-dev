import { json } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth';
import { fetchGitHubData } from '$lib/server/github/apiServices';
import type { RequestEvent } from '@sveltejs/kit';


export async function GET({ url, cookies }: RequestEvent) {
	const token = cookies.get('auth-session');
	const { session } = await validateSessionToken(token ?? '');
	if (!session?.githubToken) return new Response('Unauthorized', { status: 401 });

	const path = url.searchParams.get('path');
	if (!path) return new Response('Missing path', { status: 400 });

	try {
		const data = await fetchGitHubData(path, session.githubToken);
		return json(data);
	} catch (err) {
		console.error(`GitHub API failed for ${path}:`, err);
		return new Response('GitHub error', { status: 500 });
	}
}
