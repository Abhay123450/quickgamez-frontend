<script>
	import { onMount } from 'svelte';
	import { isLeftPanelOpen, addToast } from './stores';
	import TopNav from '$lib/components/common/TopNav.svelte';
	// let isLeftOpen = false;

	function toggleLeftPanel() {
		isLeftPanelOpen.update((isOpen) => !isOpen);
	}

	// Dummy data or fetch it from a store/api
	let games = [
		{
			id: 1,
			title: 'Guess The Movie',
			image: '/images/guess-the-movie-logo.webp',
			slug: 'guess-the-movie'
		}
		// { id: 1, title: 'Game One', image: '/images/guess-the-movie.png', slug: 'guess-the-movie' }
		// { id: 2, title: 'Game Two', image: '/path/to/image2.jpg', slug: 'game-two' }
		// Add more games...
	];

	onMount(() => {
		let lastVisit = localStorage.getItem('lastVisit');
		if (!lastVisit || Date.now() - parseInt(lastVisit) > 2 * 60 * 60 * 1000) {
			// 2 hours
			addToast('Welcome!', 'success', 10000);
			localStorage.setItem('lastVisit', Date.now().toString());
		}
	});
</script>

<svelte:head>
	<title>QuickGamez | Play online games for free</title>
	<meta
		name="description"
		content="Play free online games on our website! Enjoy hours of fun without any downloads or sign-ups. Start playing now!"
	/>
</svelte:head>

<div class="flex flex-col overflow-auto max-h-lvh">
	<TopNav />
	<!-- <h1 class="text-2xl font-bold text-center mb-6">Featured Games</h1> -->
	<!-- Scrollable container -->
	<div class="flex flex-row flex-wrap">
		{#each games as game}
			<div class="min-w-[50%] max-w-[50%] md:min-w-[33.333%] md:max-w-[33.333%] shrink-0 p-1">
				<div class="bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
					<a href={`/games/${game.slug}`}>
						<img class="rounded-t-lg w-full h-auto" src={game.image} alt={game.title} />
						<div class="align-middle">
							<h5 class="text-xl ps-1 font-semibold tracking-tight text-gray-900 dark:text-white">
								{game.title}
							</h5>
							<!-- <div class="flex items-center mt-2.5 mb-5">
							<button
								class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>
								More Info
							</button>
						</div> -->
						</div>
					</a>
				</div>
			</div>
		{/each}
		<div class="min-w-[50%] max-w-[50%] md:min-w-[33.333%] md:max-w-[33.333%] shrink-0 p-1">
			<div class="bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
				<!-- <a href={`/games/${game.slug}`}> -->
				<img
					class="rounded-t-lg w-full h-auto"
					src="/images/coming-soon.webp"
					alt="More games coming soon"
				/>
				<!-- </a> -->
			</div>
		</div>
	</div>
</div>
