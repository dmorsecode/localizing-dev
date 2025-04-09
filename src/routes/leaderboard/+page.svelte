<script lang="ts">
  import type { PageProps } from './$types';
  import * as Avatar from '$lib/components/ui/avatar';

	let { data }: PageProps = $props();
</script>

{#await data then { leaderboard }}
<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">Meet our top contributors!</h1>
    <p class="text-lg text-gray-700 max-w-3xl mx-auto">
      Every translation helps make open-source projects more accessible to the world. Our leaderboard highlights the most dedicated contributors who are bridging language gaps and making software truly global. Earn points for every approved translation and climb the ranks!
    </p>
  </div>

  <!-- Week's Rankings Banner -->
  <div class="bg-cyan-300 rounded-lg shadow-lg p-8 mb-12">
    <h2 class="text-3xl font-bold text-center mb-8">Leaderboard Rankings</h2>
    
    <!-- Podium -->
    <div class="flex items-end justify-center gap-8 mb-12">
      <!-- 2nd Place -->
      <a href={`${leaderboard[1]?.username !== undefined ? '/user/' + leaderboard[1].username : "/leaderboard"}`} class="text-center">
        <div class="rounded-full mb-2 p-0.5 bg-cyan-950 mx-auto w-20 h-20 flex items-center justify-center">
          <Avatar.Root class="h-full w-auto aspect-square">
            <Avatar.Image src={leaderboard[1]?.avatar_url} alt="@{leaderboard[1]?.username[0] ?? "??"}" />
            <Avatar.Fallback>{leaderboard[1]?.username[0]}</Avatar.Fallback>
          </Avatar.Root>
        </div>
        <div class="bg-white rounded-lg p-4 w-32 shadow-lg">
          <p class="font-bold text-xl">2<sup class="text-sm">nd</sup></p>
          <p class="font-semibold">{leaderboard[1]?.username}</p>
          <p class="text-gray-600">{leaderboard[1]?.score ?? 0} pts</p>
        </div>
      </a>

      <!-- 1st Place -->
      <a href={`${leaderboard[0]?.username !== undefined ? '/user/' + leaderboard[0].username : "/leaderboard"}`} class="text-center">
        <div class="rounded-full mb-2 p-0.5 bg-cyan-950 mx-auto w-28 h-28 flex items-center justify-center">
          <Avatar.Root class="h-full w-auto aspect-square">
            <Avatar.Image src={leaderboard[0]?.avatar_url} alt="@{leaderboard[0]?.username[0] ?? "??"}" />
            <Avatar.Fallback>{leaderboard[0]?.username[0]}</Avatar.Fallback>
          </Avatar.Root>
        </div>
        <div class="bg-white rounded-lg p-4 w-40 shadow-lg">
          <p class="font-bold text-2xl">1<sup class="text-sm">st</sup></p>
          <p class="font-semibold text-lg">{leaderboard[0]?.username}</p>
          <p class="text-gray-700">{leaderboard[0]?.score ?? 0} pts</p>
        </div>
      </a>

      <!-- 3rd Place -->
      <a href={`${leaderboard[2]?.username !== undefined ? '/user/' + leaderboard[2].username : "/leaderboard"}`} class="text-center">
        <div class="rounded-full mb-2 p-0.5 bg-cyan-950 mx-auto w-20 h-20 flex items-center justify-center">
          <Avatar.Root class="h-full w-auto aspect-square">
            <Avatar.Image src={leaderboard[2]?.avatar_url} alt="@{leaderboard[2]?.username[0] ?? "??"}" />
            <Avatar.Fallback>{leaderboard[2]?.username[0]}</Avatar.Fallback>
          </Avatar.Root>
        </div>
        <div class="bg-white rounded-lg p-4 w-32 shadow-lg">
          <p class="font-bold text-xl">3<sup class="text-sm">rd</sup></p>
          <p class="font-semibold">{leaderboard[2]?.username ?? "No One!"}</p>
          <p class="text-gray-600">{leaderboard[2]?.score ?? 0} pts</p>
        </div>
      </a>
    </div>
  </div>

  <!-- Remaining Users List -->
  <div class="space-y-2">
    {#each leaderboard.slice(3) as user, index}
      <a href={`/user/${user.username}`} class="flex items-center p-4 rounded-lg {index % 2 === 0 ? 'bg-cyan-100' : 'bg-teal-100'}">
        <img src={user.avatar_url} alt={user.username} class="w-12 h-12 rounded-full mr-4" />
        <span class="font-semibold flex-grow">{user.username}</span>
        <span class="text-gray-600 ml-4">Score: {user.score}</span>
      </a>
    {/each}
  </div>
</div> 
{/await}