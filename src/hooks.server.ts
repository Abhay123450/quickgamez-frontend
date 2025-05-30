import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const host = event.request.headers.get('host') || '';
	if (host.startsWith('www.')) {
		const url = new URL(event.request.url);
		url.hostname = host.replace(/^www\./, '');
		return Response.redirect(url.toString(), 301);
	}

	return resolve(event);
};
