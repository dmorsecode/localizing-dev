<script>
import { Badge } from '$lib/components/ui/badge/index';
import { X } from 'lucide-svelte';

export let label = '';
export let removeFunction = () => {};
</script>

<Badge
	class="shadow-md bg-cyan-300/15 border border-cyan-700/35 p-2 w-fit flex justify-between hover:scale-105 hover:bg-cyan-300/50 text-black transition-all">
	{label}
	<button on:click={(e) => {e.preventDefault(); removeFunction()}}>
	<X

		size={16}
		class="m-0 ml-2 !pointer-events-auto"
	/>
		</button>
</Badge>