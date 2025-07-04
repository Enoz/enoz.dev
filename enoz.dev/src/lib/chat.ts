export const CHATTER_API = 'https://chatter.enoz.dev';
export const CHATTER_WS = 'wss://chatter.enoz.dev';

export type ChatMessage = {
	content: string;
	author: string;
	id: string;
};

export class ChatSocket {
	ws: WebSocket;
	constructor(uuid: string, onMessage: (msg: ChatMessage) => void) {
		console.log(`${CHATTER_WS}/ws/${uuid}`);
		this.ws = new WebSocket(`${CHATTER_WS}/ws/${uuid}`);

		this.ws.addEventListener('open', () => {
			console.log('Opened!');
		});
		this.ws.addEventListener('message', (evt) => {
            console.log(evt)
			const data = evt.data;
            console.log("data", data)
			const js = JSON.parse(data) as ChatMessage;
            console.log("js", js)
			onMessage(js);
		});
	}

	close() {
		this.ws.close();
	}
}
