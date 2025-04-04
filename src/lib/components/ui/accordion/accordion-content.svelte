<script lang="ts">
  import { cn } from "$lib/utils";

  export const className: string = "";
  export let value: string;
  export let openItems: Record<string, boolean> = {};
</script>

<div
  class={cn(
    "overflow-hidden text-sm transition-all bg-blue-50 rounded-b-lg",
    openItems[value] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
  )}
  {...$$restProps}
>
  <div class="p-4">
    <slot />
  </div>
</div> 