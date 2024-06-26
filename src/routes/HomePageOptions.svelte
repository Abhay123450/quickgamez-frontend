<script>
	import { page } from '$app/stores';
	import { isLeftPanelOpen, addToast } from './stores';
	import ToggleFullscreen from '$lib/components/common/ToggleFullscreen.svelte';

	function toggleLeftPanel() {
		isLeftPanelOpen.update((isOpen) => !isOpen);
	}
</script>

<nav class="flex flex-col w-full">
	<a
		class="p-2 mx-1 mb-1 w-auto rounded-md hover:bg-neutral-100"
		class:bg-neutral-200={$page.url.pathname === '/'}
		href="/"
		aria-current={$page.url.pathname === '/'}
		on:click={toggleLeftPanel}>Home</a
	>
	<a
		class="p-2 mx-1 mb-1 w-auto rounded-md bg hover:bg-neutral-100"
		class:bg-neutral-200={$page.url.pathname === '/about'}
		href="/about"
		aria-current={$page.url.pathname === '/about'}
		on:click={toggleLeftPanel}>About</a
	>
	<p class="w-auto h-[1px] bg-neutral-300"></p>
	<p class="p-2 mx-1 mb-1 w-auto text-xl font-semibold">Options</p>
	<ToggleFullscreen />
</nav>
