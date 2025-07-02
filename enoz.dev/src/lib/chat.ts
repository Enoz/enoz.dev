export const CHATTER_API = 'https://chatter.enoz.dev';

export async function NewChat() {
	return fetch(`${CHATTER_API}/new`, {
		method: 'POST'
	});
}

export async function GetMessages(uuid: string) {
	return fetch(`${CHATTER_API}/messages/${uuid}`);
}

export async function SendMessage(uuid: string, message: string) {
	return fetch(`${CHATTER_API}/messages/${uuid}`, {
		method: 'POST',
		body: JSON.stringify({ message })
	});
}
