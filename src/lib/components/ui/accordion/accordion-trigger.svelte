<script lang="ts">
  import { cn } from "$lib/utils";
  import { ChevronDown } from "lucide-svelte";

  export let className: string = "";
  export let value: string;
  export let openItems: Record<string, boolean> = {};
  export let handleItemClick: (value: string) => void;
</script>

<button
  class={cn(
    "flex flex-1 w-full items-center justify-between py-4 px-4 font-medium transition-all hover:bg-blue-50 rounded-t-lg",
    openItems[value] ? "bg-blue-50" : "bg-white",
    className
  )}
  on:click={() => handleItemClick(value)}
  {...$$restProps}
>
  <span class="text-left"><slot /></span>
  <ChevronDown class={cn("h-4 w-4 shrink-0 transition-transform duration-200", openItems[value] ? "rotate-180" : "")} />
</button> 