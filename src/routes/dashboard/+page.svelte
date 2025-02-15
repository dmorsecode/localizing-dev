<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from "$app/forms";

	let { data }: PageProps = $props();
</script>

<h1>Hello, {data.user.username} (GitHub ID: {data.user.githubId})!</h1>
<img alt="{data.user.username}'s Avatar" src="{data.user.avatar}" class="h-[50px]" />
<br/>

<table class="border-separate border-spacing-2 text-left">
	<thead>
	<tr>
		<th></th>
		<th>Repository</th>
		<th>Stars</th>
		<th>Size</th>
	</tr>
	</thead>
	<tbody>
	{#each data.repos as repo}
		<tr>
			<td>{repo.owner.login}/</td>
			<td><a href="{repo.html_url}" class="underline">{repo.name}</a></td>
			<td>{repo.stargazers_count}</td>
			<td>{repo.size}</td>
		</tr>
	{/each}
	</tbody>
</table>

<form method="post" use:enhance>
	<button>Sign out</button>
</form>
