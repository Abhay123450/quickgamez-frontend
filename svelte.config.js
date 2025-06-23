// import adapter from '@sveltejs/adapter-auto';
import adapter from 'svelte-adapter-appengine';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		// adapter: adapter({
		// 	// default options are shown. On some platforms
		// 	// these options are set automatically — see below
		// 	pages: 'public',
		// 	assets: 'public',
		// 	fallback: 'error.html',
		// precompress: true,
		// 	strict: true
		// }),
		adapter: adapter({ out: "./public", nodejsRuntime: 20, precompress: true }),
		csp: {
			directives: {
				'script-src': ['self', 'https://accounts.google.com/gsi/client', 'https://cloud.umami.is'],
			},
			mode: 'auto'
		},

	}
};

export default config;
