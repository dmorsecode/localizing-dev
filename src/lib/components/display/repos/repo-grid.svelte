<script>
	import RepoCard from '$lib/components/display/repos/repo-card.svelte';

	export let repos;
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6 place-items-center">
	{#if repos?.length === 0}
		<p class="text-center text-muted-foreground">No repositories found.</p>
	{/if}
	{#each repos as repo}
		<RepoCard repo={repo} />
	{/each}
</div>