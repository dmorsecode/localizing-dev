<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';

	interface User {
		avatar: string;
		username: string;
	}

	export let user: User;
</script>

<div class="w-full h-[20vh] bg-gradient-to-b from-50% from-cyan-300 via-white to-transparent rounded-l-full flex gap-4 mb-4">
	<Avatar.Root class="h-full w-auto aspect-square border-0 -ml-[0.05rem] border-cyan-300">
		<Avatar.Image src={user.avatar} alt="@{user.username}" />
		<Avatar.Fallback>{user.username[0].toUpperCase()}</Avatar.Fallback>
	</Avatar.Root>
	<div class="h-full w-full flex flex-col">
		<div class="flex h-1/2 items-start text-[calc(20vh/3)] font-semibold">{user.username}</div>
		<div class="flex flex-col h-1/2 items-start">
			<div class="text-[calc(20vh/8)]">Leaderboard Score: {Math.round(Math.random() * 1000)}</div>
			<div class="text-[calc(20vh/8)]">Contributions Accepted: {Math.round(Math.random() * 20)}</div>
		</div>
	</div>
</div>