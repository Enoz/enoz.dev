import { error, redirect } from '@sveltejs/kit';
import { GetMessages, NewChat } from '$lib/chat';

export async function load({ params, request }) {
	const headers: HeadersInit = {};
	const forwardedFor = request.headers.get('x-forwarded-for');
	if (forwardedFor !== undefined) {
		headers['x-override-ip'] = forwardedFor;
	}

	// No UUID, generate a new one
	if (params.uuid === undefined) {
		const createChat = await NewChat();
		if (createChat.status == 429) {
			error(429, 'Creating chats too fast');
		}
		const chatJs = await createChat.json();
		redirect(303, `/chat/${chatJs.id}`);
	}

	// Check the health of the chat provided
	const chatHistory = await GetMessages(params.uuid, headers);
	if (chatHistory.status == 404) {
		// Chat doesn't exist, create a new one
		redirect(303, `/chat`);
	}

	// Chat exists, get history
	const history = await chatHistory.json();
	return {
		messages: history
	};
}
