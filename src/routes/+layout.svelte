<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Header from '$lib/components/layout/header.svelte';
	import Footer from '$lib/components/layout/footer.svelte';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<Toaster />

<ParaglideJS {i18n}>
	<div class="flex flex-col min-h-[100vh]">
	<Header user={data.user} />
	<main class="m-12 grow">
		{@render children()}
	</main>
	<Footer />
	</div>
</ParaglideJS>
