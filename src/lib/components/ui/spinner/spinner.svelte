<script>
	export let size = 25;
	export let speed = 750;
	export let color = 'white';
	export let thickness = 2;
	export let gap = 40;
	export let radius = 10;

	let dash;
	$: dash = 2 * Math.PI * radius * (100 - gap) / 100
</script>

<svg
	height="{size}"
	width="{size}"
	style="animation-duration:{speed}ms;"
	class="svelte-spinner"
	viewBox="0 0 32 32"
>
	<circle
		role="presentation"
		cx="16"
		cy="16"
		r="{radius}"
		stroke="{color}"
		fill="none"
		stroke-width="{thickness}"
		stroke-dasharray="{dash},100"
		stroke-linecap="round"
	/>
</svg>

<style>
    .svelte-spinner {
        transition-property: transform;
        animation-name: svelte-spinner_infinite-spin;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    @keyframes svelte-spinner_infinite-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>