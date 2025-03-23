<script lang="ts">
  import fillericon from '$lib/components/ui/pictures/fillericon.png';

  // TODO: Replace with database data
  // This will be replaced with data from the database showing:
  // - username
  // - avatar (icon)
  // - score
  const topThree = [
    { username: "Sarah Chen", score: 2450, avatar: fillericon },
    { username: "Alex Rivera", score: 2100, avatar: fillericon },
    { username: "Maria Garcia", score: 1850, avatar: fillericon }
  ];

  // TODO: Replace with database data
  const remainingUsers = [
    { username: "John Smith", score: 1750, avatar: fillericon },
    { username: "Emma Wilson", score: 1650, avatar: fillericon },
    { username: "David Kim", score: 1550, avatar: fillericon },
    { username: "Lisa Zhang", score: 1450, avatar: fillericon },
    { username: "Michael Brown", score: 1350, avatar: fillericon },
    { username: "Sophie Anderson", score: 1250, avatar: fillericon },
    { username: "Carlos Rodriguez", score: 1150, avatar: fillericon },
    { username: "Anna Schmidt", score: 1050, avatar: fillericon },
    { username: "James Wilson", score: 950, avatar: fillericon },
    { username: "Yuki Tanaka", score: 850, avatar: fillericon },
    { username: "Mohammed Ali", score: 750, avatar: fillericon },
    { username: "Elena Petrova", score: 650, avatar: fillericon },
    { username: "Thomas Müller", score: 550, avatar: fillericon },
    { username: "Nina Patel", score: 450, avatar: fillericon },
    { username: "Lucas Silva", score: 350, avatar: fillericon },
    { username: "Isabella Rossi", score: 250, avatar: fillericon },
    { username: "Oliver Schmidt", score: 150, avatar: fillericon }
  ];
</script>

<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">Meet our top contributors!</h1>
    <p class="text-lg text-gray-700 max-w-3xl mx-auto">
      Every translation helps make open-source projects more accessible to the world. Our leaderboard highlights the most dedicated contributors who are bridging language gaps and making software truly global. Earn points for every approved translation and climb the ranks!
    </p>
  </div>

  <!-- Week's Rankings Banner -->
  <div class="bg-cyan-100 rounded-lg shadow-lg p-8 mb-12">
    <h2 class="text-3xl font-bold text-center mb-8">Week's Rankings</h2>
    
    <!-- Podium -->
    <div class="flex items-end justify-center gap-8 mb-12">
      <!-- 2nd Place -->
      <div class="text-center">
        <div class="bg-white rounded-full p-2 mb-2 mx-auto w-20 h-20 flex items-center justify-center">
          <img src={topThree[1].avatar} alt={topThree[1].username} class="w-16 h-16 rounded-full" />
        </div>
        <div class="bg-white rounded-lg p-4 w-32">
          <p class="font-bold text-xl">2</p>
          <p class="font-semibold">{topThree[1].username}</p>
          <p class="text-gray-600">{topThree[1].score} pts</p>
        </div>
      </div>

      <!-- 1st Place -->
      <div class="text-center">
        <div class="bg-white rounded-full p-2 mb-2 mx-auto w-28 h-28 flex items-center justify-center">
          <img src={topThree[0].avatar} alt={topThree[0].username} class="w-24 h-24 rounded-full" />
        </div>
        <div class="bg-white rounded-lg p-4 w-40">
          <p class="font-bold text-2xl">1</p>
          <p class="font-semibold text-lg">{topThree[0].username}</p>
          <p class="text-gray-700">{topThree[0].score} pts</p>
        </div>
      </div>

      <!-- 3rd Place -->
      <div class="text-center">
        <div class="bg-white rounded-full p-2 mb-2 mx-auto w-20 h-20 flex items-center justify-center">
          <img src={topThree[2].avatar} alt={topThree[2].username} class="w-16 h-16 rounded-full" />
        </div>
        <div class="bg-white rounded-lg p-4 w-32">
          <p class="font-bold text-xl">3</p>
          <p class="font-semibold">{topThree[2].username}</p>
          <p class="text-gray-600">{topThree[2].score} pts</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Remaining Users List -->
  <div class="space-y-2">
    {#each remainingUsers as user, index}
      <div class="flex items-center p-4 rounded-lg {index % 2 === 0 ? 'bg-cyan-100' : 'bg-teal-100'}">
        <img src={user.avatar} alt={user.username} class="w-12 h-12 rounded-full mr-4" />
        <span class="font-semibold flex-grow">{user.username}</span>
        <span class="text-gray-600 ml-4">Score: {user.score}</span>
      </div>
    {/each}
  </div>
</div> 