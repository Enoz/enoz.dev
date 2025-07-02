<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { CHATTER_API } from '$lib/chat.js';
	import pfp from '$lib/assets/gh-small.png';
	import anon from './assets/anon.jpg';
	let { data } = $props();
	let messages = $state(data.messages);
	const uuid = data.uuid;

	const onSubmit = (evt) => {
		const newMessage = evt.target[0].value;
		messages.unshift({ content: newMessage, author: null, id: messages.length.toString() });
	};

	$effect(() => {
		const messageCheck = setInterval(async () => {
			try {
				const msgRes = await fetch(`${CHATTER_API}/messages/${uuid}?after=${messages.length}`);
				if (msgRes.status != 200) {
					return;
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const msgJs: Array<any> = await msgRes.json();
				if (msgJs.length > 0) {
					msgJs.forEach((msg) => {
						messages.unshift(msg);
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
	<div class="grid h-4/5 w-5/6 grid-rows-[1fr_4rem] border bg-neutral-900 p-2">
		<div class="flex h-full min-h-[0] flex-col-reverse overflow-x-hidden overflow-y-scroll">
			{#each messages as message (message.id)}
				<div
					class="flex p-4 text-wrap break-all {message.author == null ? 'flex-row-reverse' : ''}"
				>
					<img
						class="clip-circle h-[2.5rem] w-[2.5rem]"
						src={message.author == null ? anon : pfp}
						alt="Profile"
					/>
					<p class="p-2">{message.content}</p>
				</div>
				<hr class="w-[99%] self-center bg-white opacity-15" />
			{/each}
		</div>
		<div>
			<form
				class="flex h-full w-full items-center space-x-2"
				data-sveltekit-preload-data="tap"
				method="POST"
				onsubmit={onSubmit}
				use:enhance
			>
				<Input
					name="msg"
					required
					id="text-input"
					class="bg-primary text-primary-foreground"
					autocomplete="off"
					type="text"
					placeholder="Type Here"
					onblur={() => {
						setTimeout(() => {
							const el = document.getElementById('text-input');
							el?.focus();
						}, 15);
					}}
				/>
				<Button type="submit">Send</Button>
			</form>
		</div>
	</div>
</div>

<style>
	.clip-circle {
		clip-path: circle();
	}
</style>
