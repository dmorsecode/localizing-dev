<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { GitPullRequest } from 'lucide-svelte';
	import { GitFork } from 'lucide-svelte';

	export let repo;
	export let dashRequests = false;
</script>

<Card.Root class="shadow-sm border-gray-600/15 text-sm grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)]">
	<a href="{repo.html_url}">
		<Card.Header class="p-2 pb-0 flex flex-row items-start gap-2">
			<Avatar.Root>
				<Avatar.Image src="{repo.owner.avatar_url}" alt="{repo.owner.login}" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<div>
				<Card.Title>{repo.name}</Card.Title>
				<Card.Description>{repo.owner.login}</Card.Description>
			</div>
		</Card.Header>
	</a>
	<Card.Content class="p-3 pt-0">
		<p class="h-12">{repo.description ?? "No description available."}</p>
		<br />
		<Table.Root class="text-xs">
			<Table.Header>
				<Table.Row>
					<Table.Head class="px-2">Original</Table.Head>
					<Table.Head class="px-0">Requested</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="px-2 align-top">English</Table.Cell>
					<Table.Cell class="px-0">Spanish<br />Chinese<br />Portuguese<br />Russian</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Separator class="" />
	<Card.Footer class="p-2 flex justify-between gap-2">
		<p class={`${repo.license == null ? "italic text-primary/60" : ""} grow`}>{repo.license?.name ?? "No license."}</p>
		{#if !dashRequests}
			<Button href={`${repo.html_url + "/fork"}`} target="_blank" rel="noopener noreferrer" variant="outline">
				<GitFork size={16} class="mr-2" />
				Contribute
			</Button>
		{:else}
			<Button href={`${repo.html_url + "/pulls"}`} target="_blank" rel="noopener noreferrer" variant="outline">
				Close
			</Button>
			<Button href={`${repo.html_url + "/pulls"}`} target="_blank" rel="noopener noreferrer" variant="outline">
				<GitPullRequest size={16} class="mr-2" />
				View
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>