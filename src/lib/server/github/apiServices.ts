export async function fetchRepoData(repoPath: string, githubToken: string | null) {
	let res;
	if (githubToken) {
		res = await fetch(`https://api.github.com/repos/${repoPath}`, {
			headers: {
				Authorization: `Bearer ${githubToken}`,
				Accept: 'application/vnd.github+json'
			}
		});
	} else {
		res = await fetch(`https://api.github.com/repos/${repoPath}`, {
			headers: {
				Accept: 'application/vnd.github+json'
			}
		});
	}

	if (!res.ok) {
		console.error(`GitHub error (${res.status}):`, await res.text());
		throw new Error('Failed to fetch repo');
	}

	return await res.json();
}

export async function fetchPullData(pullPath: string, githubToken: string | null) {
	const repoOwner = pullPath.split("/")[0];
	const repoName = pullPath.split("/")[1];
	const pullNumber = pullPath.split("/")[3];

	let res;
	if (githubToken) {
		res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
			headers: {
				Authorization: `Bearer ${githubToken}`,
				Accept: 'application/vnd.github+json'
			}
		});
	} else {
		res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
			headers: {
				Accept: 'application/vnd.github+json'
			}
		});
	}

	if (!res.ok) {
		console.error(`GitHub error (${res.status}):`, await res.text());
		throw new Error('Failed to fetch pull data');
	}

	return await res.json();
}

export async function fetchDiffData(diffPath: string, githubToken: string | null) {
	const repoOwner = diffPath.split("/")[0];
	const repoName = diffPath.split("/")[1];
	const pullNumber = diffPath.split("/")[3];

	let res;
	if (githubToken) {
		res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
			headers: {
				Authorization: `Bearer ${githubToken}`,
				'Accept': 'application/vnd.github.diff'
			}
		});
	} else {
		res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
			headers: {
				'Accept': 'application/vnd.github.diff'
			}
		});
	}

	if (!res.ok) {
		console.error(`GitHub error (${res.status}):`, await res.text());
		throw new Error('Failed to fetch diff');
	}

	return await res.text();
}