<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from "$app/forms"

	let { data }: PageProps = $props();
</script>

<h1>Hello, {data.user.username}!</h1>
<img alt="{data.user.username}'s Avatar" src="{data.user.avatar}" class="h-[50px]" />
<br/>

<form method="post" use:enhance>
	<button>Sign out</button>
</form>
