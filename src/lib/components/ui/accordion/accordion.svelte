<script lang="ts">
  import { cn } from "$lib/utils";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let className: string = "";
  export const value: string | undefined = undefined;
  export let type: "single" | "multiple" = "single";
  export let collapsible: boolean = true;

  let openItems: Record<string, boolean> = {};

  function handleItemClick(itemValue: string) {
    if (type === "single") {
      if (openItems[itemValue]) {
        openItems = collapsible ? {} : { [itemValue]: true };
      } else {
        openItems = { [itemValue]: true };
      }
    } else {
      openItems = {
        ...openItems,
        [itemValue]: !openItems[itemValue]
      };
    }
    dispatch("change", { value: openItems });
  }
</script>

<div class={cn("w-full space-y-2", className)} {...$$restProps}>
  <slot {openItems} {handleItemClick} />
</div> 