<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="w-full text-center">
    <p style="font-size: 4rem" class="font-bold">{page.error?.message ?? "Error"}</p>
</div>