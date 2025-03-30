<script>
	import RequestCard from '$lib/components/display/repos/request-card.svelte';
	import SubmissionCard from '$lib/components/display/repos/submission-card.svelte';
	import RepoAdd from '$lib/components/display/repos/repo-add.svelte';

	export let form;
	export let userRepos;
	export let reposToDisplay;

	let type = form.data.providedLanguage != null ? "submission" : "request";
</script>

<div class="flex flex-wrap gap-4">
	{#each reposToDisplay as repo}
		{#if type === "request"}
			<RequestCard {repo} dashboard={true} />
		{:else}
			<SubmissionCard {repo} dashboard={true} />
		{/if}
	{/each}
	<RepoAdd {userRepos} {form} {type} />
</div>