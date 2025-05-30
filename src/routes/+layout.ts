import { error } from '@sveltejs/kit';

export const prerender = true;
// export const trailingSlash = 'never';

export function load({ url }) {
	if (
		url.pathname.toLowerCase().includes('.php') ||
		url.pathname.includes('.php7') ||
		url.pathname.includes('wp-admin') ||
		url.pathname.includes('wp-includes') ||
		url.pathname.includes('wp-content') ||
		url.pathname.includes('ads.txt')
	) {
		error(410, 'Gone');
	}
}
