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

	export let repo;
	export let dashboard = false;

	interface SubmissionData {
		name: string,
		html_url: string,
		owner: {
			login: string,
			avatar_url: string
		},
		description: string,
		additions: number,
		deletions: number,
		commits: number,
		points: number,
		pull_url: string,
		status: string,
		mergedAt: Date | null,
	}

	let submissionData: SubmissionData = {
		name: "",
		html_url: "",
		owner: {
			login: "",
			avatar_url: ""
		},
		description: "",
		additions: 0,
		deletions: 0,
		commits: 0,
		points: 0,
		pull_url: "",
		status: "",
		mergedAt: new Date(),
	};

	(async () => {
		// our repo.repo_url is the full url. we want everything after the .com
		const apiEndpoint = repo.pull_url.split(".com/")[1];
		const repoOwner = apiEndpoint.split("/")[0];
		const repoName = apiEndpoint.split("/")[1];
		const pullNumber = apiEndpoint.split("/")[3];
		const pullData = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`);
		// use application/vnd.github.diff for the diff
		const diffData = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
			headers: {
				'Accept': 'application/vnd.github.diff'
			}
		});
		const pull = await pullData.json();
		const diff = await diffData.text();
		// Split diff by newlines, count the byte size of every line that starts with a +. Basic algorithm for how many leaderboard points the diff is worth.
		const diffLines = diff.split("\n").filter(line => line.startsWith("+"));
		const diffSize = Math.floor(diffLines.reduce((acc, line) => acc + new Blob([line]).size, 0) / 10); // Divided by 10 to combat point inflation.
		// convert the string merged_at timestamp to a Date though
		submissionData = {
			name: pull.base?.repo.name,
			html_url: pull.html_url,
			owner: {
				login: pull.base?.repo.owner.login,
				avatar_url: pull.base?.repo.owner.avatar_url,
			},
			description: pull.body,
			additions: pull.additions,
			deletions: pull.deletions,
			commits: pull.commits,
			points: diffSize,
			pull_url: pull.html_url,
			status: pull.merged ? "merged" : "on review",
			mergedAt: pull.merged_at ? new Date(pull.merged_at) : null,
		}
	})();
</script>

{#if submissionData.html_url === ""}
	<RepoSkeleton />
{:else}
	<Card.Root
		class="flex flex-col shadow-sm border-gray-600/15 text-sm grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)]">
		<a href="{submissionData.html_url}" target="_blank" rel="noopener noreferrer">
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
						<Table.Cell class="px-2 align-top">
							Additions
						</Table.Cell>
						<Table.Cell class="px-0 text-left">
							{submissionData.additions}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="px-2 align-top">
							Deletions
						</Table.Cell>
						<Table.Cell class="px-0">
							{submissionData.deletions}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="px-2 align-top">
							Commits
						</Table.Cell>
						<Table.Cell class="px-0">
							{submissionData.commits}
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