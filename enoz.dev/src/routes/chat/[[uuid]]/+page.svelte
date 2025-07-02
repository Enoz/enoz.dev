<script lang="ts">
	import { CHATTER_API } from '$lib/chat.js';
	const { data } = $props();
	let messages = $state(data.messages);
	const uuid = data.uuid;

	$effect(() => {
		const messageCheck = setInterval(async () => {
			try {
				const msgRes = await fetch(`${CHATTER_API}/messages/${uuid}`);
				if (msgRes.status != 200) {
					return;
				}
				const msgJs = await msgRes.json();
				if (msgJs.length > messages.length) {
					messages = msgJs;
				}
			} catch (err) {
				console.error('Message Failure', err);
			}
		}, 2000);

		return () => {
			clearInterval(messageCheck);
		};
	});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="grid h-4/5 w-4/5 grid-rows-[1fr_4rem] border bg-neutral-900">
		<div class="flex h-full flex-col justify-end">
			{#each messages as message, idx (idx)}
				<div>
					<p>{JSON.stringify(message)}</p>
				</div>
			{/each}
		</div>
		<div>
			<input />
		</div>
	</div>
</div>
