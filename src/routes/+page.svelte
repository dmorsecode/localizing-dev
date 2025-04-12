<script lang="ts">
  import * as m from "$lib/paraglide/messages.js";
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";
  import talk from '$lib/components/ui/pictures/talk.png';
  import handshake from '$lib/components/ui/pictures/handshake.png';
  import trophy from '$lib/components/ui/pictures/trophy.png';
  import github from '$lib/components/ui/pictures/github.png';
  import globe from '$lib/components/ui/pictures/globe.png';
</script>

<!-- Section 1: Banner -->
<section class="w-full bg-cyan-100 py-16 rounded-2xl">
  <div class="container mx-auto px-8 flex items-center justify-between">
    <div class="max-w-2xl">
      <h1 class="text-5xl font-bold mb-6 leading-tight">
        <p>{m.home_bridging_devs()}</p>
        <p>{m.home_breaking_barriers()}</p>
      </h1>
      <p class="text-lg text-gray-700 font-semibold">
        {m.home_connect()}
      </p>
    </div>
    <div class="flex-shrink-0">
      <img src={talk} alt="Team collaboration" class="h-96 w-auto" />
    </div>
  </div>
</section>

<!-- Section 2: How it works -->
<section class="w-full py-16">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">{m.home_how_it_works()}</h2>
      <p class="text-xl text-gray-700 max-w-3xl mx-auto">
        {m.home_explanation()}
      </p>
    </div>
    
    <div class="flex items-center gap-12">
      <div class="flex-shrink-0">
        <img src={handshake} alt="Handshake" class="h-96 w-auto" />
      </div>
      
      <div class="flex-1 space-y-8">
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-bold mb-2">{m.home_step1_title()}</h3>
          <p class="text-gray-600">{m.home_step1_desc()}</p>
        </div>
        
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-bold mb-2">{m.home_step2_title()}</h3>
          <p class="text-gray-600">{m.home_step2_desc()}</p>
        </div>
        
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-bold mb-2">{m.home_step3_title()}</h3>
          <p class="text-gray-600">{m.home_step3_desc()}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Section 3: Join the Community -->
<section class="w-full bg-gray-50 py-16">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4 text-teal-600">{m.home_help_title()}</h2>
      <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        {m.home_help_subtitle()}
      </p>
      <a 
        href="/login/github" 
        class="inline-block px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 text-lg font-semibold"
      >
        {m.home_sign_up_now()}
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Card 1 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src={trophy} alt="Trophy" class="h-24 w-auto mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2 text-center">{m.home_card_left_title()}</h3>
        <p class="text-gray-600 text-center">
          {m.home_card_left_desc()}
        </p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src={github} alt="GitHub" class="h-24 w-auto mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2 text-center">{m.home_card_center_title()}</h3>
        <p class="text-gray-600 text-center">
          {m.home_card_center_desc()}
        </p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src={globe} alt="Globe" class="h-24 w-auto mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2 text-center">{m.home_card_right_title()}</h3>
        <p class="text-gray-600 text-center">
          {m.home_card_right_desc()}
        </p>
      </div>
    </div>
  </div>
</section>