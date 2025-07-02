import { error, redirect } from '@sveltejs/kit';
import { CHATTER_API } from '$lib/chat';
import type { Actions } from './$types';

export async function load({ params, fetch }) {
	// No UUID, generate a new one
	if (params.uuid === undefined) {
		const createChat = await fetch(`${CHATTER_API}/new`, {
			method: 'POST'
		});
		if (createChat.status == 429) {
			error(429, 'Creating chats too fast');
		}
		const chatJs = await createChat.json();
		redirect(303, `/chat/${chatJs.id}`);
	}

	// Check the health of the chat provided
	const chatHistory = await fetch(`${CHATTER_API}/messages/${params.uuid}`);
	if (chatHistory.status == 404) {
		// Chat doesn't exist, create a new one
		redirect(303, `/chat`);
	}

	// Chat exists, get history
	const history = await chatHistory.json();
	return {
		messages: history.reverse(),
		uuid: params.uuid
	};
}

export const actions = {
	default: async (event) => {
		if (event.params.uuid === undefined) {
			error(425, 'Sending chats requires a UUID');
		}
		const fd = await event.request.formData();
		if (!fd.has('msg')) {
			error(403, 'Missing msg field');
		}
		const message = fd.get('msg')?.toString() || '';
		fetch(`${CHATTER_API}/messages/${event.params.uuid}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: message
			})
		});
	}
} satisfies Actions;
