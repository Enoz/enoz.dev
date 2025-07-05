export const CHATTER_API = 'https://chatter.enoz.dev';
export const CHATTER_WS = 'wss://chatter.enoz.dev';

export type ChatMessage = {
	content: string;
	author: string;
	id: string;
};

export class GatewaySocket {
	ws: WebSocket;
	constructor(uuid: string, onMessage: (msg: Array<ChatMessage>) => void) {
		this.ws = new WebSocket(`${CHATTER_WS}/ws/${uuid}`);
		this.ws.addEventListener('message', (evt) => {
			if (evt.data) {
				const js = JSON.parse(evt.data);
				onMessage(js);
			}
		});
	}
}
