<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import TagComponent from '$lib/components/ui/tag/tag.svelte'
	import * as Select from '$lib/components/ui/select';
	import Plus from "svelte-radix/PlusCircled.svelte";
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { requestFormSchema, type FormSchema } from './schema';
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { LANGS } from '$lib/i18n';

	export let data: SuperValidated<Infer<FormSchema>>;
	export let repos;
	export let modalClose = () => { };

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(requestFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalClose();
				invalidateAll();
			}
		},
	});

	const { form: formData, enhance, submitting } = form;

	$: selectedRepo = $formData.url ? {
		label: $formData.url,
		value: $formData.url
	} : undefined;

	$: curSelectOpen = false;
	$: reqSelectOpen = false;

	$: tags = $formData.tags ? $formData.tags : [];

	function addTag(tag: string) {
		if (!tags.find((t) => t === tag)) {
			tags = [...tags, tag];
			$formData.tags = tags;
		}
	}

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
		$formData.tags = tags;
	}

</script>

<h1 class="font-bold text-2xl mb-8">Submit a Repository for Localization</h1>
<form method="POST" action="?/request" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="url">
		<Form.Control let:attrs>
			<Form.Label class="font-semibold">Repository</Form.Label>
			<Select.Root selected={selectedRepo} onSelectedChange={(v) => {
				if (!v) return;
				$formData.url = v.value;
				$formData.description = repos.find((repo) => repo.html_url === v.value)?.description ?? "";
			}}>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a repository" />
				</Select.Trigger>
				<Select.Content>
					{#each repos as repo}
						<Select.Item value={repo.html_url} label={repo.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.url} name={attrs.name} />
		</Form.Control>
		<!--		<Form.Description>The repository you wish to request localization for.</Form.Description>-->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="currentLangs">
		<Form.Control let:attrs>
			<Form.Label class="font-semibold">Current Languages</Form.Label>
			<Select.Root bind:open={curSelectOpen} multiple={true} onSelectedChange={(v) => {
				if (!v) return;
				$formData.currentLangs = v.map((value) => {
					if (typeof value.value === 'string') {
						return value.value;
					}
					return '';
				});
				curSelectOpen = false;
			}}>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a language" />
				</Select.Trigger>
				<Select.Content class="max-h-1/3 overflow-y-scroll">
					{#each LANGS as lang}
						<Select.Item value={lang.code} label={lang.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.currentLangs} name={attrs.name} />
		</Form.Control>
		<!--		<Form.Description>The languages that your repository currently supports.</Form.Description>-->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="requestedLangs">
		<Form.Control let:attrs>
			<Form.Label class="font-semibold">Requested Languages</Form.Label>
			<Select.Root bind:open={reqSelectOpen} multiple={true} onSelectedChange={(v) => {
				if (!v) return;
				$formData.requestedLangs = v.map((value) => {
					if (typeof value.value === 'string') {
						return value.value;
					}
					return '';
				});
				reqSelectOpen = false;
			}}>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a language" />
				</Select.Trigger>
				<Select.Content class="max-h-1/3 overflow-y-scroll">
					{#each LANGS as lang}
						<Select.Item value={lang.code} label={lang.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.requestedLangs} name={attrs.name} />
		</Form.Control>
		<!--		<Form.Description>The languages that you are requesting localizations for.</Form.Description>-->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label class="font-semibold">Project Description</Form.Label>
			<Textarea disabled={!$formData.url} {...attrs}
								placeholder={$formData.url ? "Describe your project here." : "Please select a repository."}
								bind:value={$formData.description} />
		</Form.Control>
		<!--		<Form.Description>A short description of your repository.</Form.Description>-->
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="tags">
		<Form.Control>
			<Form.Label class="font-semibold">Tags</Form.Label>
			<div class="flex gap-2 items-center">
				<!-- listen for someone pressing enter when typing in the input to add the tag and also log it to console -->
				<Input placeholder="Add tags" on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ',') {
						e.preventDefault();
						if (e.currentTarget.value === '') return;
						addTag(e.currentTarget.value);
						e.currentTarget.value = '';
					}
				}} />
			</div>
			<div class="flex gap-2 flex-wrap">
			{#each tags as tag}
				<TagComponent label={tag} removeFunction={() => removeTag(tag)} />
			{/each}
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Spinner />
	<Form.Button class="font-semibold">
		{#if $submitting}
			<Spinner />
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>