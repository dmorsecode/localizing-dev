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

		const subData = await fetch(`/api/db/submission?path=${repo.pull_url}`);
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
			status: pull.merged ? "merged" : "on review",
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
		<a href="{submissionData.pull_url}" target="_blank" rel="noopener noreferrer">
			<Card.Header class="p-2 pb-0 flex flex-row items-start gap-2">
				<Avatar.Root>
					<Avatar.Image src="{submissionData.owner?.avatar_url}" alt="{submissionData.owner?.login}" />
					<Avatar.Fallback>{submissionData.owner?.login[0]}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<Card.Title>{submissionData.name}</Card.Title>
					<Card.Description>{submissionData.owner?.login}</Card.Description>
				</div>
			</Card.Header>
		</a>
		<Card.Content class="p-3 grow pt-0">
			<p class="overflow-auto text-justify">{submissionData.description ?? "No description available."}</p>
			<br />
			<Table.Root class="text-sm">
				<Table.Body>
					<Table.Row>
						<Table.Cell class="px-2 align-top font-semibold">
							<p>Localization</p>
						</Table.Cell>
						<Table.Cell class="px-0">
							<p>{LANGS.find((l) => l.code === submissionData.language)?.name}</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="px-2 align-top">
							<p>Additions</p>
						</Table.Cell>
						<Table.Cell class="px-0 text-left">
							<p>{submissionData.additions}</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="px-2 align-top">
							<p>PR Size</p>
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
			<p class="px-2 grow"><span class="font-bold">Points:</span> {submissionData.status === "merged" ? submissionData.points : 0}</p>
			<p class="px-2 font-semibold">{submissionData.mergedAt?.toLocaleDateString("en", { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
		</Card.Footer>
	</Card.Root>
{/if}