<script>
	import RequestCard from '$lib/components/display/repos/request-card.svelte';
	import SubmissionCard from '$lib/components/display/repos/submission-card.svelte';
	import RepoAdd from '$lib/components/display/repos/repo-add.svelte';

	export let form;
	export let userRepos;
	export let reposToDisplay;
	export let bookmarks = false;

	let type = form?.data.providedLanguage != null ? "submission" : "request";
</script>

<div class="flex flex-wrap gap-4">
	{#each reposToDisplay as repo}
		{#if type === "request"}
			<RequestCard {repo} dashboard={true} bookmark={bookmarks} />
		{:else}
			<SubmissionCard {repo} dashboard={true} />
		{/if}
	{/each}
	{#if !bookmarks}
		<RepoAdd {userRepos} {form} {type} />
	{/if}
</div>