<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col w-full h-auto p-1 bg-white rounded-b space-y-1 overflow-y-auto">
	<a
		class="flex p-2 w-auto rounded-md hover:bg-neutral-100 font-medium {$page.url.pathname ===
		'/games/guess-the-movie'
			? 'border border-neutral-400 bg-neutral-100'
			: ''}"
		href="/games/guess-the-movie"
		aria-current={$page.url.pathname === '/games/guess-the-movie'}
		on:click={(e) => {
			if ($page.url.pathname === '/games/guess-the-movie') {
				return e.preventDefault();
			}
		}}>Guess The Movie</a
	>
</div>
