import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith('https://chatter.enoz.dev')) {
		const forwardedFor = event.request.headers.get('x-forwarded-for');
		if (forwardedFor != undefined) {
			request.headers.append('x-override-ip', forwardedFor);
		}
	}

	return fetch(request);
};
