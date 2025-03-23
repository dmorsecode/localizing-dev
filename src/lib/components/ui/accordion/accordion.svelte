<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { createEventDispatcher } from "svelte";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let type: "single" | "multiple" = "single";
  export let collapsible = false;
  export let defaultValue: string | string[] | undefined = undefined;

  const dispatch = createEventDispatcher();
  let selectedValue: string | string[] = defaultValue || (type === "single" ? "" : []);
</script>

<div
  class={cn("w-full", className)}
  {...$$restProps}
>
  <slot />
</div> 