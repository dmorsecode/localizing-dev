<script lang="ts">
	import * as m from "$lib/paraglide/messages.js";
	import RequestCard from '$lib/components/display/repos/request-card.svelte';
	import SubmissionCard from '$lib/components/display/repos/submission-card.svelte';
	import RepoAdd from '$lib/components/display/repos/repo-add.svelte';
	import { onMount } from 'svelte';

	export let form = null;
	export let userRepos = null;
	export let reposToDisplay;
	export let type = "request";
	export let dashboard = false;

	let bookmarks : string[] = [];

	onMount(async () => {
		bookmarks = await fetch(`/api/db/bookmarks`)
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return [];
		});
	});
</script>

<div class="flex flex-wrap gap-4">
	{#if (reposToDisplay === null || reposToDisplay?.length === 0) && !dashboard}
		<p class="text-center text-muted-foreground">{m.no_repos_found()}</p>
	{/if}
	{#key reposToDisplay}
		{#each reposToDisplay as repo}
			{#if type === "request"}
				<RequestCard {repo} {dashboard} {bookmarks} />
			{:else}
				<SubmissionCard {repo} />
			{/if}
		{/each}
	{/key}
	{#if dashboard}
		<RepoAdd {userRepos} {form} {type} />
	{/if}
</div>