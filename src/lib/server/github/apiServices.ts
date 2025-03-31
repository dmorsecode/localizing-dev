export async function fetchGitHubData(repoPath: string, githubToken: string) {
	const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
		headers: {
			Authorization: `Bearer ${githubToken}`,
			Accept: 'application/vnd.github+json'
		}
	});

	if (!res.ok) {
		console.error(`GitHub error (${res.status}):`, await res.text());
		throw new Error('Failed to fetch repo');
	}

	return await res.json();
}
