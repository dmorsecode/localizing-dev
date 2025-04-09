<script lang="ts">
  import * as m from "$lib/paraglide/messages.js";
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "$lib/components/ui/accordion";
  import { Input } from "$lib/components/ui/input";

  let searchQuery = "";
  let openItems: Record<string, boolean> = {};

  function toggleItem(itemId: string) {
    openItems = {
      ...openItems,
      [itemId]: !openItems[itemId]
    };
  }

  const faqItems = [
    {
      id: "github-account",
      question: m.faqs_account_question(),
      answer: m.faqs_account_answer()
    },
    {
      id: "contribute",
      question: m.faqs_contribute_question(),
      answer: m.faqs_contribute_answer()
    },
    {
      id: "review",
      question: m.faqs_review_question(),
      answer: m.faqs_review_answer()
    },
    {
      id: "submit",
      question: m.faqs_submit_question(),
      answer: m.faqs_submit_answer()
    },
    {
      id: "leaderboard",
      question: m.faqs_leaderboard_question(),
      answer: m.faqs_leaderboard_answer()
    }
  ];

  $: filteredItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-4xl font-bold mb-4">{m.faqs_title()}</h1>
  <p class="text-gray-600 mb-8">{m.faqs_subtitle()}</p>
  
  <div class="mb-8">
    <Input
      type="text"
      placeholder={m.faqs_search()}
      bind:value={searchQuery}
      class="w-full"
    />
  </div>
  
  <Accordion>
    {#each filteredItems as item}
      <AccordionItem value={item.id} {openItems} handleItemClick={toggleItem}>
        <AccordionTrigger value={item.id} {openItems} handleItemClick={toggleItem}>
          {item.question}
        </AccordionTrigger>
        <AccordionContent value={item.id} {openItems}>
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    {/each}
  </Accordion>
</div> 