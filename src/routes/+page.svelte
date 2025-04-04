<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";
  import talk from '$lib/components/ui/pictures/talk.png';
  import handshake from '$lib/components/ui/pictures/handshake.png';
  import trophy from '$lib/components/ui/pictures/trophy.png';
  import github from '$lib/components/ui/pictures/github.png';
  import globe from '$lib/components/ui/pictures/globe.png';
</script>

<!-- Section 1: Banner -->
<section class="w-full bg-cyan-100 py-16">
  <div class="container mx-auto px-4 flex items-center justify-between">
    <div class="max-w-2xl">
      <h1 class="text-5xl font-bold mb-6 leading-tight">
        Bridging Developers,<br />
        Breaking Language Barriers.
      </h1>
      <p class="text-lg text-gray-700">
        Localizing.dev helps developers collaborate on open-source projects by making translations seamless. Connect your GitHub repository, crowdsource translations, and make your project accessible to a global audience—all in one place.
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
      <h2 class="text-3xl font-bold mb-4">How it works</h2>
      <p class="text-lg text-gray-700 max-w-3xl mx-auto">
        Localizing.dev automates the localization process for open-source projects. Instead of manually managing translations, our platform allows developers and contributors to collaborate in real time. Whether you're a maintainer or a contributor, you'll have the tools to simplify, streamline, and scale your project's accessibility.
      </p>
    </div>
    
    <div class="flex items-center gap-12">
      <div class="flex-shrink-0">
        <img src={handshake} alt="Handshake" class="h-96 w-auto" />
      </div>
      
      <div class="flex-1 space-y-8">
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-bold mb-2">Connect your Repository</h3>
          <p class="text-gray-600">Sign in with GitHub and link your open-source repository to request translations among collaborators worldwide.</p>
        </div>
        
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-bold mb-2">Community-Powered Translations</h3>
          <p class="text-gray-600">Developers and contributors can suggest and review translations using an intuitive interface, ensuring accuracy and consistency.</p>
        </div>
        
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="text-xl font-bold mb-2">Merge & Deploy with ease</h3>
          <p class="text-gray-600">Once translations are verified, export them directly into your project. Keep your codebase localized without extra hassle.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Section 3: Join the Community -->
<section class="w-full bg-gray-50 py-16">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4 text-teal-600">Join the Community!</h2>
      <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        Be part of the movement to make open-source truly global. Start localizing today and help projects reach users worldwide!
      </p>
      <a 
        href="/login/github" 
        class="inline-block px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 text-lg font-semibold"
      >
        Connect Now
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Card 1 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src={trophy} alt="Trophy" class="h-24 w-auto mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2 text-center">Recognize Top Contributors</h3>
        <p class="text-gray-600 text-center">
          Contributors earn points and recognition for their translations. Enter our leaderboard and get rewarded to help make projects more accessible.
        </p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src={github} alt="GitHub" class="h-24 w-auto mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2 text-center">Sync your Repo in Seconds</h3>
        <p class="text-gray-600 text-center">
          All you need to do is connect with your Github account! Once you make a request, our translators will be on it!
        </p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <img src={globe} alt="Globe" class="h-24 w-auto mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2 text-center">Translate Together, Build Together</h3>
        <p class="text-gray-600 text-center">
          Empower the open-source community to contribute translations, ensuring your project reaches a global audience with accuracy and cultural relevance.
        </p>
      </div>
    </div>
  </div>
</section>