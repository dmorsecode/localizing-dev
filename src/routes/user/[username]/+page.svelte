<script lang="ts">
	import type { PageProps } from './$types';
	import * as m from "$lib/paraglide/messages.js";
	import ProfileBanner from '$lib/components/display/profile-banner/profile-banner.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import RepoGrid from '$lib/components/display/repos/repo-grid.svelte';

	let { data }: PageProps = $props();
</script>

{#await data then { userProfile, requests, submissions, leaderboardScore }}
	<ProfileBanner userInfo={userProfile} score={leaderboardScore?.l_score ?? 0} submissionCount={submissions?.filter(sub => sub.status === "merged").length ?? 0} />

	<Separator class="my-4" />

	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">{m.requests()}</h1>
		<RepoGrid reposToDisplay={requests} />
	</div>

	<Separator class="my-6" />

	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">{m.contributions()}</h1>
		<RepoGrid reposToDisplay={submissions} type="submission" />
	</div>
{/await}