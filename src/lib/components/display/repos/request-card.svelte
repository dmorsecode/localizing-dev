<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { GitPullRequest } from 'lucide-svelte';
	import { GitFork } from 'lucide-svelte';
	import { LANGS } from '$lib/i18n';
	import RepoSkeleton from '$lib/components/display/repos/repo-skeleton.svelte';
	import { onMount } from 'svelte';


	export let repo;
	export let dashboard = false;

	// define repo interface
	interface RepoData {
		name: string;
		html_url: string;
		owner: {
			login: string;
			avatar_url: string;
		};
		description: string;
		license: {
			name: string;
		};
	}

	let repoData : RepoData = {
		name: "",
		html_url: "",
		owner: {
			login: "",
			avatar_url: ""
		},
		description: "",
		license: {
			name: ""
		},
	};
	// (async () => {
	// 	// our repo.repo_url is the full url. we want everything after the .com
	// 	const apiEndpoint = repo.repo_url.split(".com/")[1];
	// 	const repoRes = await fetch(`https://api.github.com/repos/${apiEndpoint}`);
	// 	repoData = await repoRes.json();
	// 	console.log(repo);
	// })();
	onMount(async () => {
		const apiEndpoint = repo.repo_url.split('.com/')[1];
		const res = await fetch(`/api/github/repo?path=${apiEndpoint}`);
		repoData = await res.json();
	});
</script>

{#if repoData.html_url === ""}
	<RepoSkeleton />
{:else}
	<Card.Root
		class="min-h-80 flex flex-col shadow-sm border-gray-600/15 text-sm grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)]">
		<a href="{repoData.html_url}" target="_blank" rel="noopener noreferrer">
			<Card.Header class="p-2 pb-0 flex flex-row items-start gap-2">
				<Avatar.Root>
					<Avatar.Image src="{repoData.owner.avatar_url}" alt="{repoData.owner.login}" />
					<Avatar.Fallback>{repoData.owner.login[0]}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<Card.Title>{repoData.name}</Card.Title>
					<Card.Description>{repoData.owner.login}</Card.Description>
				</div>
			</Card.Header>
		</a>
		<Card.Content class="p-3 pt-0 grow">
			<p class="h-12">{repo.description ?? repoData.description ?? "No description available."}</p>
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
						<Table.Cell class="px-2 align-top">
							{#each repo.requested_languages as lang}
								<p>{LANGS.find((l) => l.code === lang)?.name}</p>
							{/each}
						</Table.Cell>
						<Table.Cell class="px-0">
							{#each repo.requested_languages as lang}
								<p>{LANGS.find((l) => l.code === lang)?.name}</p>
							{/each}
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
		<Separator class="" />
		<Card.Footer class="p-2 flex justify-between gap-2">
			<p
				class={`${repoData.license == null ? "italic text-primary/60" : ""} grow`}>{repoData.license?.name ?? "No license."}</p>
			{#if !dashboard}
				<Button href={`${repoData.html_url + "/fork"}`} target="_blank" rel="noopener noreferrer" variant="outline">
					<GitFork size={16} class="mr-2" />
					Contribute
				</Button>
			{:else}
				<Button href={`${repoData.html_url + "/pulls"}`} target="_blank" rel="noopener noreferrer" variant="outline">
					Close
				</Button>
				<Button href={`${repoData.html_url + "/pulls"}`} target="_blank" rel="noopener noreferrer" variant="outline">
					<GitPullRequest size={16} class="mr-2" />
					View
				</Button>
			{/if}
		</Card.Footer>
	</Card.Root>
{/if}