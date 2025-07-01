import { error, redirect } from '@sveltejs/kit';

const CHATTER_API = 'https://chatter.enoz.dev';

export async function load({ params }) {
	if (params.uuid === undefined) {
		const createChat = await fetch(`${CHATTER_API}/new`, {
			method: 'POST'
		});
		if (createChat.status == 429) {
			error(429, 'Creating chats too fast');
		}
		const chatJs = await createChat.json();
		redirect(307, `/chat/${chatJs.id}`);
	}
}
