<script lang="ts">
	import * as m from "$lib/paraglide/messages.js";
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

	export let repo: {
		s_id: string;
		pull_url: string;
		request_id: string;
		translator_id: string;
	};

	interface SubmissionData {
		name: string,
		owner: {
			login: string,
			avatar_url: string
		},
		description: string,
		additions: number,
		deletions: number,
		commits: number,
		language: string,
		points: number,
		pull_url: string,
		status: string,
		diffSize: number,
		mergedAt: Date | null,
	}

	let submissionData: SubmissionData = {
		name: "",
		owner: {
			login: "",
			avatar_url: ""
		},
		description: "",
		additions: 0,
		deletions: 0,
		commits: 0,
		language: "",
		points: 0,
		pull_url: "",
		status: "",
		diffSize: 0,
		mergedAt: new Date(),
	};

	onMount(async () => {
		const apiEndpoint = repo.pull_url.split('.com/')[1];
		const pullData = await fetch(`/api/github/pull?path=${apiEndpoint}`);
		const pull = await pullData.json();

		const diffData = await fetch(`/api/github/diff?path=${apiEndpoint}`);
		const diff = await diffData.json();
		const diffSize = new Blob([diff]).size;

		const reqData = await fetch(`/api/db/request?path=${pull.base?.repo.html_url}`);
		const req = await reqData.json();

		const subData = await fetch(`/api/db/submission?path=${repo.pull_url}&merged=${pull.merged}`);
		const sub = await subData.json();

		submissionData = {
			name: pull.base?.repo.name,
			owner: {
				login: pull.base?.repo.owner.login,
				avatar_url: pull.base?.repo.owner.avatar_url,
			},
			description: req.description,
			additions: pull.additions,
			deletions: pull.deletions,
			commits: pull.commits,
			language: sub.provided_language,
			points: sub.earned_points,
			pull_url: repo.pull_url,
			status: pull.merged || sub.status === "merged" ? "merged" : "on review",
			diffSize: parseFloat((diffSize / 1024).toFixed(1)),
			mergedAt: pull.merged_at ? new Date(pull.merged_at) : null,
		}
	});
</script>

{#if submissionData.pull_url === ""}
	<RepoSkeleton />
{:else}
	<Card.Root
		class="flex flex-col shadow-sm border-gray-600/15 text-sm grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)]">
		<div class="flex justify-between items-start gap-2">
			<Card.Header class={`${submissionData.status !== "merged" ? "opacity-30" : ""} p-2 pb-0 flex flex-row items-start gap-2`}>
				<Avatar.Root>
					<Avatar.Image src="{submissionData.owner.avatar_url}" alt="{submissionData.owner.login}" />
					<Avatar.Fallback>{submissionData.owner.login[0]}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<Card.Title><a href="{submissionData.pull_url}" target="_blank" rel="noopener noreferrer">{submissionData.name}</a></Card.Title>
					<Card.Description><a href="{submissionData.pull_url}" target="_blank" rel="noopener noreferrer">{submissionData.owner.login}</a></Card.Description>
				</div>
			</Card.Header>
			<!-- {#if submissionData.status !== "merged"}
				<Button size="sm" class="m-2 font-semibold cursor-pointer active:scale-[105%] transition-transform duration-200">
					Refresh	
				</Button>
			{/if} -->
		</div>
		<Card.Content class={`${submissionData.status !== "merged" ? "opacity-30" : ""} p-3 grow pt-0`}>
			<p class="overflow-auto text-justify">{submissionData.description ?? "No description available."}</p>
			<br />
			<Table.Root class="text-sm">
				<Table.Body>
					<Table.Row>
						<Table.Cell class="px-2 align-top font-semibold">
							<p>{m.localization()}</p>
						</Table.Cell>
						<Table.Cell class="px-0">
							<p>{LANGS.find((l) => l.code === submissionData.language)?.name}</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="px-2 align-top">
							<p>{m.submission_additions()}</p>
						</Table.Cell>
						<Table.Cell class="px-0 text-left">
							<p>{submissionData.additions}</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="px-2 align-top">
							<p>{m.submission_pr_size()}</p>
						</Table.Cell>
						<Table.Cell class="px-0">
							<p>{submissionData.diffSize} <small>Kb</small></p>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
		<Separator class="" />
		<Card.Footer class="p-2 flex justify-between gap-2">
			{#if submissionData.status === "merged"}
				<p class="px-2 grow"><span class="font-bold">{m.points()}:</span> {submissionData.points}</p>
			{:else}
				<p class="italic font-semibold px-2">{m.submission_not_merged()}</p>
			{/if}
			<p class="px-2 font-semibold">{submissionData.mergedAt?.toLocaleDateString("en", { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
		</Card.Footer>
	</Card.Root>
{/if}