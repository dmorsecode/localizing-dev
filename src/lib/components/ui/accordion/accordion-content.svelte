<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    open: boolean;
  }

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let open = false;
</script>

{#if open}
  <div
    class={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...$$restProps}
  >
    <div class="pb-4 pt-0">
      <slot />
    </div>
  </div>
{/if} 