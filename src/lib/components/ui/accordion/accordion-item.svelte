<script lang="ts">
  import { cn } from "$lib/utils";

  export let value: string;
  export let className: string = "";
  export let openItems: Record<string, boolean> = {};
  export let handleItemClick: (value: string) => void;
</script>

<div class={cn("border rounded-lg overflow-hidden", className)} {...$$restProps}>
  <slot {value} {openItems} {handleItemClick} open={openItems[value] || false} />
</div> 