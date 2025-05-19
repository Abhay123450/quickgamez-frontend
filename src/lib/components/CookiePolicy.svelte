<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { showCookieSettings } from '../../routes/stores';
	import { trapFocus } from '$lib/actions';

	type CookiePreferences = {
		necessary: boolean;
		analytics: boolean;
		marketing: boolean;
	};

	let showBanner = false;
	let showSettings = false;
	let preferences: CookiePreferences = {
		necessary: true,
		analytics: false,
		marketing: false
	};

	const savePreferences = () => {
		localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
		showBanner = false;
		$showCookieSettings = false;
		showSettings = false;
	};

	const acceptAll = () => {
		preferences = {
			necessary: true,
			analytics: true,
			marketing: true
		};
		savePreferences();
	};

	const rejectAll = () => {
		preferences = {
			necessary: true,
			analytics: false,
			marketing: false
		};
		savePreferences();
	};

	onMount(() => {
		const saved = localStorage.getItem('cookiePreferences');
		if ($showCookieSettings) {
			showBanner = true;
		} else {
			showBanner = !saved;
		}
		if (saved) preferences = JSON.parse(saved);
	});
</script>

{#if showBanner || $showCookieSettings}
	<div
		use:trapFocus
		in:fly={{ y: 100, duration: 300 }}
		out:fly={{ y: 100, duration: 300 }}
		class="fixed bottom-0 left-0 md:left-4 md:bottom-4 lg:bottom-8 lg:left-8 w-full max-w-3xl max-h-dvh bg-yellow-200 text-black px-4 py-6 border-2 md:border border-black rounded-t-md md:rounded-b-md shadow-lg overflow-y-auto z-50"
	>
		<div class="max-w-4xl mx-auto flex flex-col items-start justify-between">
			<h2 class="text-lg font-semibold">It's Cookie Time 🍪</h2>
			<p class="text-base flex-1 mt-1">
				We use cookies to enhance your browsing experience, analyze site traffic, and personalize
				content. Click “Accept All” to enjoy full functionality and a seamless experience. See our
				<a
					href="/privacy-policy"
					class="underline underline-offset-2 text-blue-700 hover:text-blue-800"
					target="_blank">Privacy Policy</a
				>.
			</p>
			<div class="w-full md:w-fit mt-4 flex flex-col md:flex-row gap-2 self-end">
				<button
					on:click={() => (showSettings = !showSettings)}
					class="text-base w-full md:w-fit border border-black rounded-md px-4 py-2 bg-white hover:bg-neutral-200 transition"
				>
					Cookie Settings
				</button>
				<button
					on:click={rejectAll}
					class="text-base w-full md:w-fit bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
				>
					Reject
				</button>
				<button
					on:click={acceptAll}
					class="text-base w-full md:w-fit bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
				>
					Accept All
				</button>
			</div>
		</div>

		{#if showSettings || $showCookieSettings}
			<div class="mt-4 p-4 bg-white rounded-xl">
				<div class="flex items-center justify-between mb-2">
					<label class="text-base" for="necessaryCookies">Necessary (always enabled)</label>
					<input id="necessaryCookies" type="checkbox" checked disabled class="form-checkbox" />
				</div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-base" for="analyticsCookies">Analytics</label>
					<input
						id="analyticsCookies"
						type="checkbox"
						bind:checked={preferences.analytics}
						class="form-checkbox"
					/>
				</div>
				<div class="flex items-center justify-between mb-4">
					<label class="text-base" for="marketingCookies">Marketing</label>
					<input
						id="marketingCookies"
						type="checkbox"
						bind:checked={preferences.marketing}
						class="form-checkbox"
					/>
				</div>
				<div class="text-right">
					<button
						on:click={savePreferences}
						class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-base transition"
					>
						Save Preferences
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
