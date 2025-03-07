<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';

	export let user;
</script>

<header class="w-full flex justify-between items-center p-4 border-b bg-cyan-300/75">
	<div class="flex gap-2 place-items-center">
		<a href="/" class="text-2xl font-bold">localizing.dev</a>
	</div>
	<div class="flex gap-6 place-items-center uppercase">
		<a href="/faq" class="text-sm font-semibold">FAQ</a>
		<a href="/about" class="text-sm font-semibold">About Us</a>
		<a href="/leaderboard" class="text-sm font-semibold">Leaderboard</a>
		<a href="/repositories" class="text-sm font-semibold">Repositories</a>
		{#if user}
			<DropdownMenu.Root preventScroll={false}>
				<DropdownMenu.Trigger>
					<Avatar.Root>
						<Avatar.Image src={user.avatar} alt={user.username} />
						<Avatar.Fallback>{user.username}</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item><a href="/dashboard">Dashboard</a></DropdownMenu.Item>
						<DropdownMenu.Item>
							<form method="POST" action="/logout">
								<button type="submit" class="w-full text-left cursor-pointer">Logout</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<a href="/login" class="text-sm font-semibold">Login</a>
		{/if}
	</div>
</header>