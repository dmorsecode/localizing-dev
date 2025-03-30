import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { getUserFromGitHubId, createUser } from '$lib/server/services/userService';
import { github } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	console.log(tokens.accessToken());

	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubEmail = githubUser.email;
	const githubUsername = githubUser.login;
	const githubAvatar = githubUser.avatar_url;

	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/dashboard'
			}
		});
	}

	const user = await createUser(githubUserId, githubEmail, githubUsername, githubAvatar);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/dashboard'
		}
	});
}
