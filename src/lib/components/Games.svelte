<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col w-full h-auto p-1 bg-white rounded-b space-y-0.5 overflow-y-auto">
	<a
		class="flex p-2 w-auto rounded-md hover:bg-neutral-100 {$page.url.pathname ===
		'/games/guess-the-movie/hollywood'
			? 'border border-neutral-400 bg-neutral-100'
			: ''}"
		href="/games/guess-the-movie/hollywood"
		aria-current={$page.url.pathname === '/games/guess-the-movie/hollywood'}
		on:click={(e) => {
			if ($page.url.pathname === '/games/guess-the-movie/hollywood') {
				return e.preventDefault();
			}
		}}>Guess The Movie - Hollywood</a
	>
	<a
		class="flex p-2 w-auto rounded-md hover:bg-neutral-100 {$page.url.pathname ===
		'/games/guess-the-movie/bollywood'
			? 'border border-neutral-400 bg-neutral-100'
			: ''}"
		href="/games/guess-the-movie/bollywood"
		aria-current={$page.url.pathname === '/games/guess-the-movie/bollywood'}
		on:click={(e) => {
			if ($page.url.pathname === '/games/guess-the-movie/bollywood') {
				return e.preventDefault();
			}
		}}>Guess The Movie - Bollywood</a
	>
	<a
		class="flex p-2 w-auto rounded-md hover:bg-neutral-100 {$page.url.pathname ===
		'/games/rebus-puzzles'
			? 'border border-neutral-400 bg-neutral-100'
			: ''}"
		href="/games/rebus-puzzles"
		aria-current={$page.url.pathname === '/games/rebus-puzzles'}
		on:click={(e) => {
			if ($page.url.pathname === '/games/rebus-puzzles') {
				return e.preventDefault();
			}
		}}>Rebus Puzzles</a
	>
</div>
