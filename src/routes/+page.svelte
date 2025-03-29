<script lang="ts">
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	let { data }: PageProps = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button class="border m-2" on:click={() => toast("Hello world!")}>Show test toast</Button>

{#await data.user}
	Loading...
{:then user}
	{#if user === null || user === undefined}
		<p>No user found</p>
	{:else}
		<h1>Welcome, {user?.username}!</h1>
		<p><strong>Email:</strong> {user?.email}</p>
		<p><strong>Points:</strong> {user?.points}</p>
		<img src={user?.avatar} alt="Avatar" width="100" />
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}