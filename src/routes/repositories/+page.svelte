<script lang="ts">
	import type { PageProps } from './$types';
	import SearchFilter from '$lib/components/display/search-filter/search-filter.svelte';
	import SearchFilterForm from '$lib/components/forms/search-filter-form/search-filter-form.svelte';
	import RepoGrid from '$lib/components/display/repos/repo-grid.svelte';
	import { Separator } from '$lib/components/ui/separator';

	let { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-2 bg-cyan-300 p-4 rounded-lg">
	<h1 class="text-2xl font-bold">Open Repositories</h1>
	<h2 class="text-lg font-semibold">Find a repository to contribute to.</h2>
	<SearchFilter />
	<SearchFilterForm data={data.searchForm!} />
</div>

<Separator class="my-8" />

<RepoGrid reposToDisplay={data.repos?.data} type="request" />