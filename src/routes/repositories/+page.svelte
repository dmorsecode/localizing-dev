<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from "$app/navigation";
	import { invalidate, invalidateAll } from '$app/navigation';
	import ChevronLeft from "svelte-radix/ChevronLeft.svelte";
  	import ChevronRight from "svelte-radix/ChevronRight.svelte";
	import SearchFilterForm from '$lib/components/forms/search-filter-form/search-filter-form.svelte';
	import RepoGrid from '$lib/components/display/repos/repo-grid.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let { data }: PageProps = $props();

	let perPage = data.repos?.perPage || 8;
	let siblingCount = 0;
</script>

<div class="flex flex-col gap-2 bg-cyan-300 p-4 rounded-lg">
	<h1 class="text-2xl font-bold">Open Repositories</h1>
	<h2 class="text-lg font-semibold">Find a repository to contribute to.</h2>
	{#key data.searchForm}
		<SearchFilterForm data={data.searchForm!} />
	{/key}
</div>

<Separator class="my-8" />

<div class="mb-4">
	<RepoGrid reposToDisplay={data.repos?.data} type="request" />
</div>

{#key data.totalPages}
	<Pagination.Root count={data.totalPages ? data.totalPages * data.perPage : 0} {perPage} {siblingCount} let:pages let:currentPage page={data.currentPage} onPageChange={page => {
		// change the url parameter to the new page number and invalidate the page
		const url = new URL(window.location.href);
		url.searchParams.set("page", page.toString());
		goto(url.toString());
	}}>
		<Pagination.Content>
		<Pagination.Item class="cursor-pointer">
			<Pagination.PrevButton class="cursor-pointer">
			<ChevronLeft class="h-4 w-4" />
			<span class="hidden sm:block">Previous</span>
			</Pagination.PrevButton>
		</Pagination.Item>
		{#each pages as page (page.key)}
			{#if page.type === "ellipsis"}
			<Pagination.Item class="cursor-pointer">
				<Pagination.Ellipsis />
			</Pagination.Item>
			{:else}
			<Pagination.Item class="cursor-pointer">
				<Pagination.Link class="cursor-pointer" {page} isActive={currentPage === page.value}>
				{page.value}
				</Pagination.Link>
			</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item class="cursor-pointer">
			<Pagination.NextButton class="cursor-pointer">
				<span class="hidden sm:block">Next</span>
				<ChevronRight class="h-4 w-4" />
			</Pagination.NextButton>
		</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
  {/key}