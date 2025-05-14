<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col w-full h-auto p-1 bg-white rounded-b space-y-1 overflow-y-auto">
	<a
		class="flex p-2 w-auto rounded-md hover:bg-neutral-100 font-medium {$page.url.pathname ===
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
		class="flex p-2 w-auto rounded-md hover:bg-neutral-100 font-medium {$page.url.pathname ===
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
</div>
