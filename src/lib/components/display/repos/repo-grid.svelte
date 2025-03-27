<script>
	import RepoCard from '$lib/components/display/repos/repo-card.svelte';
	import RepoAdd from '$lib/components/display/repos/repo-add.svelte';

	export let form;
	export let userRepos;
	export let reposToDisplay;
	export let dashRequests = false;
</script>

<div class="flex flex-wrap gap-4">
	{#if reposToDisplay?.length === 0 && !dashRequests}
		<p class="text-center text-muted-foreground">No repositories found.</p>
	{/if}
	{#each reposToDisplay as repo}
		<RepoCard {repo} {dashRequests} />
	{/each}
	{#if dashRequests}
		<RepoAdd {userRepos} {form} />
	{/if}
</div>