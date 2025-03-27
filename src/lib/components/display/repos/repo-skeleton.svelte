<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<Card.Root
	class="min-h-80 flex flex-col shadow-sm border-gray-600/15 text-sm grow basis-1/3 max-w-[calc(50%-1rem)] md:basis-1/4 md:max-w-[calc(33%-1rem)] lg:basis-1/5 lg:max-w-[calc(25%-1rem)]">
	<div>
		<Card.Header class="p-2 pb-0 flex flex-row items-start gap-2">
			<Skeleton class="rounded-full w-10 h-10" />
			<div class="grow">
				<Skeleton class="w-48 h-4" />
				<Skeleton class="w-24 h-4 mt-1" />
			</div>
		</Card.Header>
	</div>
	<Card.Content class="p-3 pt-0 grow">
		<Skeleton class="w-full h-4 mb-1" />
		<Skeleton class="w-full h-4 mb-1" />
		<br />
		<Table.Root class="text-xs">
			<Table.Header>
				<Table.Row>
					<Table.Head class="px-2"><Skeleton class="w-[50%] h-4" /></Table.Head>
					<Table.Head class="px-0"><Skeleton class="w-[75%] h-4" /></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="px-2 align-top">
						<Skeleton class="w-16 h-4" />
					</Table.Cell>
					<Table.Cell class="px-0">
						<Skeleton class="w-16 h-4" />
						<Skeleton class="w-16 h-4 mt-1" />
						<Skeleton class="w-16 h-4 mt-1" />
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Separator class="" />
	<Card.Footer class="p-2 flex justify-between gap-2">
		<div class="grow">
		<Skeleton class="w-1/3 h-4" />
		</div>
		<Button variant="outline">
			<Skeleton class="w-10 h-4" />
		</Button>
		<Button variant="outline">
			<Skeleton class="w-10 h-4" />
		</Button>
	</Card.Footer>
</Card.Root>