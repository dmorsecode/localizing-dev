<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Badge } from "$lib/components/ui/badge";
	import { Input } from '$lib/components/ui/input';
	import { X } from 'lucide-svelte';
	import SearchTags from '$lib/components/display/search-filter/search-tags.svelte';

	interface Tag {
		value: string;
		label: string;
	}

	let selectedTags: Array<Tag> = [{ value: "1", label: "Tag 1" },
	{ value: "2", label: "Tag 2" },
	{ value: "3", label: "Tag 3" },
	{ value: "4", label: "Tag 4" },
	{ value: "5", label: "Tag 5" }];

	function addTag(tag: Tag) {
		console.log(tag);
		if (!selectedTags.find((t) => t.label === tag.label)) {
			selectedTags = [...selectedTags, tag];
		}
	}

</script>

<div class="w-full shadow-md bg-white rounded grid grid-cols-3 gap-2 p-4 py-2">
	<div class="w-10/12 flex flex-col">
		<h1 class="font-bold mb-2">FILTER BY LANGUAGE</h1>
		<div class="flex flex-col justify-items-center w-1/2 gap-2">
			<Select.Root>
				<Select.Trigger>
					<Select.Value placeholder="Original Language" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="english">English</Select.Item>
					<Select.Item value="french">French</Select.Item>
					<Select.Item value="russian">Russian</Select.Item>
				</Select.Content>
			</Select.Root>
			<p class="w-full text-center">to...</p>
			<Select.Root>
				<Select.Trigger>
					<Select.Value placeholder="Requested Language" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="english">English</Select.Item>
					<Select.Item value="french">French</Select.Item>
					<Select.Item value="russian">Russian</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	<div class="w-10/12 flex flex-col gap-2 uppercase">
		<h1 class="font-bold">FILTER BY METRIC</h1>
		<div class="flex flex-row items-center gap-2">
			<Input placeholder="0" class="w-32" />
			<p>≤ &nbsp;&nbsp;Size&nbsp; (KB) ≤</p>
			<Input placeholder="0" class="w-32" />
		</div>
		<div class="flex flex-row items-center gap-2">
			<Input placeholder="0" class="w-32" />
			<p>≤ Stars (KB) ≤</p>
			<Input placeholder="0" class="w-32" />
		</div>
		<div class="w-32">
			<Select.Root>
				<Select.Trigger>
					<Select.Value placeholder="License" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="english">MIT License</Select.Item>
					<Select.Item value="russian">GNU Public License</Select.Item>
					<Select.Item value="french">Unlicensed</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	<div class="w-10/12 flex flex-col gap-2 uppercase">
		<h1 class="font-bold">FILTER BY TAGS</h1>
		<SearchTags addTag={(v: Tag) => addTag(v)} />
		<div>
		{#each selectedTags as tag}
			<button class="mr-2 mb-2" on:click={() => selectedTags = selectedTags.filter((t) => t.label !== tag.label)}>
			<Badge class="shadow-md bg-cyan-300/25 border border-cyan-700/35 p-2 w-24 flex justify-between hover:scale-105 hover:bg-cyan-300/50 text-black transition-all">
				{tag.label}
				<X
					size={16}
					class="m-0 ml-2"
				/>
			</Badge>
			</button>
		{/each}
			</div>
	</div>
</div>