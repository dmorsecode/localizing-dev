<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { GitPullRequest } from 'lucide-svelte';
	import { GitFork } from 'lucide-svelte';
	import { Bookmark } from 'lucide-svelte';
	import { LANGS } from '$lib/i18n';
	import RepoSkeleton from '$lib/components/display/repos/repo-skeleton.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { onMount } from 'svelte';


	export let repo: {
		repo_url: string;
		r_id: string;
		cur_languages: { language: string }[];
		languages: { language: string }[];
		description: string;
	};
	export let dashboard = false;
	export let bookmarks: string[] = [];
	export let bookmark = false;

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
		bookmarked?: boolean;
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
		bookmarked: false
	};

	onMount(async () => {
		const apiEndpoint = repo.repo_url.split('.com/')[1];
		const res = await fetch(`/api/github/repo?path=${apiEndpoint}`);
		repoData = await res.json();
		if (bookmarks.length === 0 && !bookmark) {
			repoData.bookmarked = false;
		} else {
			repoData.bookmarked = bookmarks?.find((b) => b === repo.r_id) !== undefined || bookmark;
		}
	});

	function toggleBookmark(): void {
		if (repoData.bookmarked === undefined) return;
		if (repoData.bookmarked == true) {
			repoData.bookmarked = undefined;
			removeBookmark();
		} else {
			repoData.bookmarked = undefined;
			bookmarkRepo();
		}
	};

	function removeBookmark() {
		fetch('/api/db/bookmarks', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				request_id: repo.r_id
			})
		}).then((res) => {
			if (res.ok) {
				repoData.bookmarked = false;
			} else {
				console.error("Error removing bookmark: ", res.statusText);
			}
		});
	}

	function bookmarkRepo() {
		// add bookmark to database
		fetch('/api/db/bookmarks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				request_id: repo.r_id
			})
		}).then((res) => {
			if (res.ok) {
				repoData.bookmarked = true;
			} else {
				console.error("Error adding bookmark: ", res.statusText);
			}
		});
	}
</script>

{#if repoData.html_url === ""}
	<RepoSkeleton />
{:else}
	<Card.Root
		class="min-h-80 flex flex-col shadow-sm border-gray-600/15 text-sm grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)]">
		<div class="flex justify-between items-start gap-2">
			<Card.Header class="p-2 pb-0 flex flex-row items-start gap-2">
				<Avatar.Root>
					<Avatar.Image src="{repoData.owner.avatar_url}" alt="{repoData.owner.login}" />
					<Avatar.Fallback>{repoData.owner.login[0]}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<Card.Title><a href="{repoData.html_url}" target="_blank" rel="noopener noreferrer">{repoData.name}</a></Card.Title>
					<Card.Description><a href="{repoData.html_url}" target="_blank" rel="noopener noreferrer">{repoData.owner.login}</a></Card.Description>
				</div>
			</Card.Header>
			{#if !dashboard || bookmark}
				<Button variant="ghost" class="p-0 m-0 rounded-none rounded-bl-[25%] cursor-pointer active:scale-[105%] transition-transform duration-200" on:click={toggleBookmark}>
					<Bookmark size={24} strokeWidth={1} class={`m-2 transition-opacity ${repoData.bookmarked === undefined ? "opacity-20" : ""}`} color={`${repoData.bookmarked === true ? "oklch(68.1% 0.162 75.834)" : "oklch(20.5% 0 0)"}`} fill={`${repoData.bookmarked === true ? "oklch(85.2% 0.199 91.936)" : "#FFFFFFFF"}`} />
				</Button>
			{/if}
		</div>
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
							{#each repo.cur_languages as lang}
								<p>{LANGS.find((l) => l.code === lang.language)?.name}</p>
							{/each}
						</Table.Cell>
						<Table.Cell class="px-0">
							{#each repo.languages as lang}
								<p>{LANGS.find((l) => l.code === lang.language)?.name}</p>
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
			{#if !dashboard || bookmark}
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