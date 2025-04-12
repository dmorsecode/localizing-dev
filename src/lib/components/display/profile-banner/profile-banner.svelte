<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as m from "$lib/paraglide/messages.js";

	export let userInfo;
	export let submissionCount = 0;
	export let score = 0;
</script>

<div class="w-full h-[20vh] bg-gradient-to-b from-50% from-cyan-300 via-white to-transparent rounded-l-full flex gap-4 mb-4">
	<Avatar.Root class="h-full w-auto aspect-square border-0 -ml-[0.05rem] border-cyan-300">
		<Avatar.Image src={userInfo.avatar} alt="@{userInfo.username}" />
		<Avatar.Fallback>{userInfo.username[0].toUpperCase()}</Avatar.Fallback>
	</Avatar.Root>
	<div class="h-full w-full flex flex-col">
		<div class="flex h-1/2 items-start text-[calc(20vh/3)] font-semibold">{userInfo.username}</div>
		<div class="flex flex-col h-1/2 items-start">
			<div class="text-[calc(20vh/8)]">{m.leaderboard_score()}: {score}</div>
			<div class="text-[calc(20vh/8)]">{m.contributions_accepted()}: {submissionCount}</div>
		</div>
	</div>
</div>