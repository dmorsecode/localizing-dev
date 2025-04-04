<script lang="ts">
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
      question: "Do I need a github account?",
      answer: "Yes, since Localizing.dev integrates directly with GitHub repositories, a GitHub account is required to contribute and manage projects."
    },
    {
      id: "contribute",
      question: "How can I contribute to a project?",
      answer: "Please log in with your Github account and go to Respositories, select the repository you'd like to send a contribution to."
    },
    {
      id: "review",
      question: "Do translations get reviewed?",
      answer: "Your translations will get reviewed by the repository owner once they are sent, and you will be notified once they are approved."
    },
    {
      id: "cost",
      question: "Is there a cost for using Localizing.dev?",
      answer: "No, the program is completely free."
    },
    {
      id: "leaderboard",
      question: "How does the leaderboard work?",
      answer: "Your accepted contributions will generate a score that will be added to your dashboard. Every week, our leaderboard will be updated with the rankings of all users that had the highest contribution score. Please keep putting the good work to reach the top!"
    }
  ];

  $: filteredItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
  <p class="text-gray-600 mb-8">Lost on how to start your translator-collaborator journey? We got you covered. Find answers to common questions about Localizing.dev</p>
  
  <div class="mb-8">
    <Input
      type="text"
      placeholder="Search questions..."
      bind:value={searchQuery}
      class="w-full"
    />
  </div>
  
  <Accordion>
    {#each filteredItems as item}
      <AccordionItem value={item.id} {openItems} handleItemClick={toggleItem}>
        <AccordionTrigger value={item.id} {openItems} handleItemClick={toggleItem}>
          <div class="w-full grow">{item.question}</div>
        </AccordionTrigger>
        <AccordionContent value={item.id} {openItems}>
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    {/each}
  </Accordion>
</div> 