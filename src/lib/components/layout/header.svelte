<script lang="ts">
	import * as m from "$lib/paraglide/messages.js";
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import logo from '$lib/components/ui/pictures/logo-notext.png';

	export let user;
</script>

<header class="w-full h-12 flex justify-between items-center p-4 py-8 border-b bg-cyan-300">
	<div class="h-12">
		<a href="/" class="flex items-center h-12">
			<img src={logo} alt="localizing.dev" class="h-12 p-0 m-0 w-auto" />
		</a>
	</div>
	<div class="flex gap-6 place-items-center uppercase mr-4">
		<a href="/faq" class="text-lg font-semibold">{m.faq()}</a>
		<!-- <a href="https://github.com/dmorsecode/localizing-dev" target="_blank" rel="noopener noreferrer" class="text-lg font-semibold">About Us</a> -->
		<a href="/leaderboard" class="text-lg font-semibold">{m.leaderboard()}</a>
		<a href="/repositories" class="text-lg font-semibold">{m.repositories()}</a>
		{#if user}
			<DropdownMenu.Root preventScroll={false}>
				<DropdownMenu.Trigger class="cursor-pointer">
					<Avatar.Root>
						<Avatar.Image src={user.avatar} alt={user.username} />
						<Avatar.Fallback>{user.username[0].toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{m.header_account()}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item><a href="/dashboard">{m.header_dashboard()}</a></DropdownMenu.Item>
						<DropdownMenu.Item>
							<form method="POST" action="/logout">
								<button type="submit" class="w-full text-left cursor-pointer">{m.header_logout()}</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<a 
				href="/login/github" 
				class="px-4 py-2 bg-cyan-900 text-white rounded-md hover:bg-cyan-700 transition-colors duration-200 text-sm font-semibold"
			>
				{m.header_login()}
			</a>
		{/if}
	</div>
</header>