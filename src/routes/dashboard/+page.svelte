<script lang="ts">
	import * as m from "$lib/paraglide/messages.js";
	import type { PageProps } from './$types';
	import ProfileBanner from '$lib/components/display/profile-banner/profile-banner.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import DashboardGrid from '$lib/components/display/repos/dashboard-grid.svelte';

	let { data }: PageProps = $props();
</script>

{#await data then { user, requests, submissions, bookmarks, repos, leaderboardScore, requestForm, submissionForm }}
	<ProfileBanner userInfo={user} score={leaderboardScore?.l_score ?? 0} submissionCount={submissions?.filter(sub => sub.status === "merged").length ?? 0} />

	<Separator class="my-4" />

	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">{m.requests()}</h1>
		<DashboardGrid reposToDisplay={requests} userRepos={repos} form={requestForm} />
	</div>

	<Separator class="my-6" />

	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">{m.contributions()}</h1>
		<DashboardGrid reposToDisplay={submissions} userRepos={repos} form={submissionForm} />
	</div>

	{#if bookmarks !== undefined && bookmarks.length > 0}
		<Separator class="my-6" />

		<div class="flex flex-col gap-4">
			<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">{m.bookmarks()}</h1>
			<DashboardGrid reposToDisplay={bookmarks} bookmarks={true} userRepos={null} form={null} />
		</div>
	{/if}
{/await}