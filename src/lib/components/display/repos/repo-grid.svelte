<script>
	import RepoCard from '$lib/components/display/repos/repo-card.svelte';

	export let repos;
	export let dashRequests = false;
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8 justify-between">
	{#if repos?.length === 0}
		<p class="text-center text-muted-foreground">No repositories found.</p>
	{/if}
	{#each repos as repo}
		<RepoCard {repo} {dashRequests} />
	{/each}
</div>