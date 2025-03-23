<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { ChevronDown } from "lucide-svelte";

  type $$Props = HTMLAttributes<HTMLButtonElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<button
  class={cn(
    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
    className
  )}
  on:click
  {...$$restProps}
>
  <slot />
  <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" />
</button> 