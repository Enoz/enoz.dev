import { error, redirect } from '@sveltejs/kit';
import { CHATTER_API } from '$lib/chat';
import type { Actions } from './$types';
import type { ServerLoadEvent } from '@sveltejs/kit';

export async function load({ params, fetch }: ServerLoadEvent) {
	if (params.uuid === undefined) {
		return {
			messages: []
		};
	}

	// Check the health of the chat provided
	const chatHistory = await fetch(`${CHATTER_API}/messages/${params.uuid}`);
	if (chatHistory.status == 404) {
		// Chat doesn't exist, redirect
		redirect(303, `/chat`);
	}

	// Chat exists, get history
	const history = await chatHistory.json();
	return {
		messages: history.reverse()
	};
}

export const actions = {
	default: async (event) => {
		const fd = await event.request.formData();
		if (!fd.has('msg')) {
			error(403, 'Missing msg field');
		}
		let isFirstMessage = false;
		let uuid = event.params.uuid;
		if (event.params.uuid === undefined) {
			const createChat = await fetch(`${CHATTER_API}/new`, {
				method: 'POST'
			});
			if (createChat.status == 429) {
				error(429, 'Creating chats too fast');
			}
			const chatJs = await createChat.json();
			uuid = chatJs.id;
			isFirstMessage = true;
		}
		const message = fd.get('msg')?.toString() || '';
		const msgRes = fetch(`${CHATTER_API}/messages/${uuid}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: message
			})
		});

		if (isFirstMessage) {
			await msgRes;
			redirect(303, `/chat/${uuid}`);
		}
	}
} satisfies Actions;
