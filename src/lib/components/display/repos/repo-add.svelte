<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Plus from 'svelte-radix/Plus.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import RepoRequestForm from '$lib/components/forms/repo-request-form/repo-request-form.svelte';
	import SubmissionForm from '$lib/components/forms/submission-form/submission-form.svelte';

	export let userRepos;
	export let form;
	export let type;

	$: isOpen = false;

	function modalClose() {
		isOpen = false;
	}
</script>

<Card.Root
	class="min-h-72 inset-shadow-xs scale-100 bg-gray-100 grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)] transition-transform duration-[30ms] active:scale-[99%]">
	<Card.Content class="p-0 h-full">
		<Dialog.Root bind:open={isOpen}>
			<Dialog.Trigger class="w-full h-full flex items-center justify-center cursor-pointer active:scale-[99%]">
				<Plus size="128" color="#00000022" />
			</Dialog.Trigger>
			<Dialog.Content>
				{#if type === "request"}
					<RepoRequestForm data={form} repos={userRepos} {modalClose} />
				{:else if type === "submission"}
					<SubmissionForm data={form} {modalClose} />
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	</Card.Content>
</Card.Root>