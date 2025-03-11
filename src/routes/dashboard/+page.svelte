<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from "$app/forms";
	import ProfileBanner from '$lib/components/display/profile-banner/profile-banner.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import RepoGrid from '$lib/components/display/repos/repo-grid.svelte';

	let { data }: PageProps = $props();

	let exampleRequests = [];
	for (let i = 0; i < 3; i++) {
		exampleRequests.push(data.repos[i]);
	}
</script>

<ProfileBanner user={data.user} />

<Separator class="my-4" />

<div class="flex flex-col gap-4">
<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">Requests</h1>
<RepoGrid repos={exampleRequests} dashRequests={true} />
</div>

<Separator class="my-6" />

<div class="flex flex-col gap-4">
<h1 class="text-3xl font-bold underline underline-offset-8 uppercase">Contributions</h1>
<RepoGrid repos={data.repos} dashRequests={false} />
</div>