<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col w-full h-auto bg-white rounded-b space-y-1 overflow-y-auto pb-1">
	<a class="self-center" href="/">
		<img class="w-48 h-auto mb-1" src="/images/logo.webp" alt="website-logo" />
	</a>
	<a
		class="p-2 mx-1 mb-1 w-auto rounded-md hover:bg-neutral-100
		{$page.url.pathname === '/' ? 'border border-gray-400 bg-neutral-100' : ''}"
		href="/"
		aria-current={$page.url.pathname === '/'}
		on:click={(e) => {
			if ($page.url.pathname === '/') {
				return e.preventDefault();
			}
			// closeLoginPanel();
		}}>Home</a
	>
	<a
		class="p-2 mx-1 mb-1 w-auto rounded-md bg hover:bg-neutral-100
		{$page.url.pathname === '/about' ? 'border border-gray-400 bg-neutral-100' : ''}"
		href="/about"
		aria-current={$page.url.pathname === '/about'}
		on:click={(e) => {
			if ($page.url.pathname === '/about') {
				return e.preventDefault();
			}
			// closeLoginPanel();
		}}>About</a
	>

	<!-- <p class="w-auto h-[1px] bg-gray-300"></p> -->
	<!-- <h3 class="px-2 pt-2 mx-1 mb-1 w-auto text-xl font-semibold">Games</h3>
	<a
		class="flex p-2 mx-1 mb-1 w-auto rounded-md hover:bg-yellow-100 font-medium
		{$page.url.pathname === '/games/guess-the-movie' ? 'border border-gray-300 bg-yellow-200' : ''}"
		href="/games/guess-the-movie"
		aria-current={$page.url.pathname === '/games/guess-the-movie'}
		on:click={(e) => {
			if ($page.url.pathname === '/games/guess-the-movie') {
				return e.preventDefault();
			}
			closeLoginPanel();
		}}>Guess The Movie</a
	> -->
</div>
