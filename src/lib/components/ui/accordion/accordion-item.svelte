<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    value: string;
  }

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let value: string;

  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<div
  class={cn("border-b bg-blue-50", className)}
  data-state={isOpen ? "open" : "closed"}
  data-value={value}
  {...$$restProps}
>
  <slot />
</div> 