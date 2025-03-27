<script lang="ts">
	import type { PageProps } from './$types';
	import ProfileBanner from '$lib/components/display/profile-banner/profile-banner.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import RepoGrid from '$lib/components/display/repos/repo-grid.svelte';

	// define a page data interface with form, user, repos, and requests
	// this is the data that will be passed to the page component
	export let data: PageProps['data'];

	// let { data }: PageProps = $props();
</script>

<ProfileBanner user={data.user} />

<Separator class="my-4" />

<div class="flex flex-col gap-4">
<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">Requests</h1>
<RepoGrid reposToDisplay={data.requests} userRepos={data.repos} form={data.form} dashRequests={true} />
</div>

<Separator class="my-6" />

<div class="flex flex-col gap-4">
<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">Contributions</h1>
<RepoGrid reposToDisplay={data.requests} userRepos={data.repos} form={data.form} dashRequests={false} />
</div>