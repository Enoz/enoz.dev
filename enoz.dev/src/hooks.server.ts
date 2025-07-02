import type { HandleFetch } from '@sveltejs/kit';
import { CHATTER_API } from '$lib/chat';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(CHATTER_API)) {
		const forwardedFor = event.request.headers.get('x-forwarded-for');
		if (forwardedFor != undefined) {
			request.headers.set('x-override-ip', forwardedFor);
		}
	}

	return fetch(request);
};
