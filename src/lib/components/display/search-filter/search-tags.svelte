<script lang="ts">
	import * as m from "$lib/paraglide/messages.js";
	import * as Select from "$lib/components/ui/select/index.js";

	const tags = [
		{ value: "1", label: "Tag 1" },
		{ value: "2", label: "Tag 2" },
		{ value: "3", label: "Tag 3" },
		{ value: "4", label: "Tag 4" },
		{ value: "5", label: "Tag 5" }
	];

	let { addTag } = $props();

</script>

<Select.Root onSelectedChange={(v) => {
          		addTag(v);
        }}>
	<Select.Trigger class="">
		<Select.Value placeholder="Select a tag" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{m.tags()}</Select.Label>
			{#each tags as tag}
				<Select.Item value={tag.value} label={tag.label}
				>{tag.label}</Select.Item
				>
			{/each}
		</Select.Group>
	</Select.Content>
	<Select.Input name="selectedTag" />
</Select.Root>