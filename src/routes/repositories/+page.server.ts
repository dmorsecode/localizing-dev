export async function load() {
	// const repos = await fetch(`https://api.github.com/users/${event.locals.user.username}/repos`);
	const repos = await fetch(`https://api.github.com/users/sveltejs/repos`);
	const repos2 = await fetch(`https://api.github.com/users/bluesky-social/repos`);
	const repos3 = await fetch(`https://api.github.com/users/dmorsecode/repos`);
	const repos4 = await fetch(`https://api.github.com/users/immich-app/repos`);
	const reposJson = await repos.json();
	const reposJson2 = await repos2.json();
	const reposJson3 = await repos3.json();
	const reposJson4 = await repos4.json();

	reposJson.length = Math.min(reposJson.length, 10);
	reposJson2.length = Math.min(reposJson2.length, 10);
	reposJson3.length = Math.min(reposJson3.length, 10);
	reposJson4.length = Math.min(reposJson4.length, 10);

	reposJson.push(...reposJson2);
	reposJson.push(...reposJson3);
	reposJson.push(...reposJson4);
	reposJson.sort(() => Math.random() - 0.5);

	reposJson.length = Math.min(reposJson.length, 25);

	return {
		repos: reposJson
	};
}