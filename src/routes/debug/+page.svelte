<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<form class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<label for="name">Name</label>
		<input type="text" id="name" name="name" />
	</div>
	<div class="flex flex-col gap-2">
		<label for="description">Description</label>
		<textarea id="description" name="description"></textarea>
	</div>
	<div class="flex flex-col gap-2">
		<label for="url">URL</label>
		<input type="text" id="url" name="url" />
	</div>
	<button type="submit">Submit</button>
</form>