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
	<div class="h-4/5 w-4/5 border">
		{#each messages as message, idx (idx)}
			<p>{JSON.stringify(message)}</p>
		{/each}
	</div>
</div>
