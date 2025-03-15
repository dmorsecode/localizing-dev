<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";

	export let data;
  	const user = data.user;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button class="border m-2" on:click={() => toast("Hello world!")}>Show test toast</Button>

{#if user}
  <h1>Welcome, {user.username}!</h1>
  <p><strong>Email:</strong> {user.email}</p>
  <p><strong>Points:</strong> {user.points}</p>
  <img src={user.avatar} alt="Avatar" width="100" />
{:else}
  <p>User not found.</p>
{/if}