<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { submissionFormSchema, type FormSchema } from './schema';
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { LANGS } from '$lib/i18n';

	export let data: SuperValidated<Infer<FormSchema>>;
	export let modalClose = () => {
	};

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(submissionFormSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				modalClose();
				invalidateAll();
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

</script>

<h1 class="font-bold text-2xl mb-8">Submit a Repository for Localization</h1>
<form method="POST" action="?/submission" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="url">
		<Form.Control let:attrs>
			<Form.Label class="font-semibold">Repository</Form.Label>
			<Input {...attrs} bind:value={$formData.url} placeholder="Pull Request URL" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="providedLanguage">
		<Form.Control let:attrs>
			<Form.Label class="font-semibold">Localization</Form.Label>
			<Select.Root onSelectedChange={(v) => {
					if (!v || typeof v.value !== "string") return;
					$formData.providedLanguage = v.value;
        }}>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a language" />
				</Select.Trigger>
				<Select.Content class="max-h-1/2 overflow-y-scroll">
					{#each LANGS as lang}
						<Select.Item value={lang.code} label={lang.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.providedLanguage} name={attrs.name} />
		</Form.Control>
				<Form.Description>What language did you translate the repository into?</Form.Description>
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