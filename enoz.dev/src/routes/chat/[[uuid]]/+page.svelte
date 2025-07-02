<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';

	import { CHATTER_API } from '$lib/chat.js';
	const { data } = $props();
	let messages = $state(data.messages);
	const uuid = data.uuid;

	const predictSend = (evt) => {
		const newMessage = evt.target[0].value;
		messages.push({ content: newMessage, author: null });
	};

	$effect(() => {
		const messageCheck = setInterval(async () => {
			try {
				const msgRes = await fetch(`${CHATTER_API}/messages/${uuid}?after=${messages.length}`);
				if (msgRes.status != 200) {
					return;
				}
				const msgJs: Array<any> = await msgRes.json();
				if (msgJs.length > 0) {
					msgJs.forEach((msg) => {
						messages.push(msg);
					});
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
	<div class="grid h-4/5 w-4/5 grid-rows-[1fr_4rem] border bg-neutral-900 p-2">
		<div class="flex h-full flex-col justify-end">
			{#each messages as message, idx (idx)}
				<div>
					<p>{JSON.stringify(message)}</p>
				</div>
			{/each}
		</div>
		<div>
			<form
				class="flex h-full w-full items-center space-x-2"
				data-sveltekit-preload-data="tap"
				method="POST"
				onsubmit={predictSend}
				use:enhance
			>
				<Input
					name="msg"
					class="bg-primary text-primary-foreground"
					autocomplete="off"
					type="text"
					placeholder="Type Here"
				/>
				<Button type="submit">Send</Button>
			</form>
		</div>
	</div>
</div>
