<script lang="ts">
	import type { PageData } from './$types.js';
	import SettingsForm from '$lib/components/forms/repo-submission-form/repo-submission-form.svelte';

	export let data: PageData;
</script>

<div class="w-1/3 border shadow-md rounded-md p-12 m-auto">
	<SettingsForm data={data.form} repos={data.repos} />
</div>