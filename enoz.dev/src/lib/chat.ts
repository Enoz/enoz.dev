export const CHATTER_API = 'https://chatter.enoz.dev';

export async function NewChat(headers?: HeadersInit) {
	return fetch(`${CHATTER_API}/new`, {
		method: 'POST',
		headers
	});
}

export async function GetMessages(uuid: string, headers?: HeadersInit) {
	return fetch(`${CHATTER_API}/messages/${uuid}`, {
		headers
	});
}

export async function SendMessage(uuid: string, message: string, headers?: HeadersInit) {
	return fetch(`${CHATTER_API}/messages/${uuid}`, {
		method: 'POST',
		body: JSON.stringify({ message }),
		headers
	});
}
