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
	import { searchFilterFormSchema, type FormSchema } from './schema';
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { LANGS } from '$lib/i18n';

	export let data: SuperValidated<Infer<FormSchema>>;

		const licenses = [
			{ key: "agpl-3.0", name: "AGPL-3.0" },
			{ key: "apache-2.0", name: "Apache-2.0" },
			{ key: "bsd-2-clause", name: "BSD-2-Clause \"Simplified\" License" },
			{ key: "bsd-3-clause", name: "BSD-3-Clause \"New\" or \"Revised\" License" },
			{ key: "bsl-1.0", name: "Boost Software License 1.0" },
			{ key: "cc0-1.0", name: "Creative Commons Zero v1.0 Universal" },
			{ key: "epl-2.0", name: "Eclipse Public License 2.0" },
			{ key: "gpl-2.0", name: "GNU General Public License v2.0" },
			{ key: "gpl-3.0", name: "GNU General Public License v3.0" },
			{ key: "lgpl-2.1", name: "GNU  Lesser General Public License v2.1" },
			{ key: "mit", name: "MIT License" },
			{ key: "mpl-2.0", name: "Mozilla Public License 2.0" },
			{ key: "unlicense", name: "The Unlicense" }
		]

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(searchFilterFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				invalidateAll();
			}
		},
	});

	const { form: formData, enhance, submitting } = form;

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
<form method="POST" use:enhance class="flex flex-row justify-between gap-24 bg-white p-4 rounded-md shadow-md">
	<div class="grow basis-1/3">
		<Form.Field {form} name="repoName">
			<Form.Control let:attrs>
				<Form.Label class="font-semibold">Repository Name</Form.Label>
				<Input {...attrs} bind:value={$formData.repoName} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="currentLang">
			<Form.Control let:attrs>
				<Form.Label class="font-semibold">Original Language</Form.Label>
				<Select.Root onSelectedChange={(v) => {
						if (!v || typeof v.value !== "string") return;
						$formData.currentLang = v.value;
			}}>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Choose a language" />
					</Select.Trigger>
					<Select.Content class="max-h-1/2 overflow-y-scroll">
						{#each LANGS as lang}
							<Select.Item value={lang.code} label={lang.name} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.currentLang} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="requestedLang">
			<Form.Control let:attrs>
				<Form.Label class="font-semibold">Requested Language</Form.Label>
				<Select.Root onSelectedChange={(v) => {
						if (!v || typeof v.value !== "string") return;
						$formData.requestedLang = v.value;
			}}>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Choose a language" />
					</Select.Trigger>
					<Select.Content class="max-h-1/2 overflow-y-scroll">
						{#each LANGS as lang}
							<Select.Item value={lang.code} label={lang.name} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.requestedLang} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div>
		<div class="flex flex-row gap-4 items-center">
			<Form.Field {form} name="minKb">
				<Form.Control let:attrs>
					<Form.Label class="font-semibold">Minimum Kb.</Form.Label>
					<Input {...attrs} bind:value={$formData.minKb} placeholder=0 />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="maxKb">
				<Form.Control let:attrs>
					<Form.Label class="font-semibold">Maximum Kb.</Form.Label>
					<Input {...attrs} bind:value={$formData.maxKb} placeholder="Unlimited" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="flex flex-row gap-4 items-center">
			<Form.Field {form} name="minStars">
				<Form.Control let:attrs>
					<Form.Label class="font-semibold">Minimum Stars</Form.Label>
					<Input {...attrs} bind:value={$formData.minStars} placeholder=0 />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="maxStars">
				<Form.Control let:attrs>
					<Form.Label class="font-semibold">Maximum Stars</Form.Label>
					<Input {...attrs} bind:value={$formData.maxStars} placeholder="Unlimited" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="license">
			<Form.Control let:attrs>
				<Form.Label class="font-semibold">License</Form.Label>
				<Select.Root onSelectedChange={(v) => {
					if (!v || typeof v.value !== "string") return;
					$formData.license = v.value;
				}}>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="License" />
					</Select.Trigger>
					<Select.Content>
						{#each licenses as license}
							<Select.Item value={license.key} label={license.name} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.license} name={attrs.name} />
			</Form.Control>
			<!--		<Form.Description>The repository you wish to request localization for.</Form.Description>-->
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="basis-1/3 flex flex-col grow justify-between">
		<Form.Field {form} name="tags">
			<Form.Control>
				<Form.Label class="font-semibold">Required Tags</Form.Label>
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
		<Form.Button class="font-semibold">
			{#if $submitting}
				<Spinner />
			{:else}
				Submit
			{/if}
		</Form.Button>
	</div>
</form>