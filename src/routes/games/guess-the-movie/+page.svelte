<script>
	import Footer from '$lib/components/common/Footer.svelte';
	import TopNav from '$lib/components/common/TopNav.svelte';
	import LdTag from '$lib/jsonld/LDTag.svelte';
	import { guessTheMovieSchema } from './guessTheMovieSchema';

	let games = [
		{
			id: 1,
			title: 'Guess The Movie - Hollywood',
			image: '/images/thumbnail/guess-the-movie-hollywood.webp',
			slug: 'guess-the-movie/hollywood'
		},
		{
			id: 2,
			title: 'Guess The Movie - Bollywood',
			image: '/images/thumbnail/guess-the-movie-bollywood.webp',
			slug: 'guess-the-movie/bollywood'
		}
	];
</script>

<svelte:head>
	<title>QuickGamez - Play online games for free</title>
	<meta
		name="description"
		content="Test your movie knowledge with our fun movie guessing games. Currently available for hollywood and bollywood movies."
	/>
	<LdTag schema={guessTheMovieSchema} />
	<link rel="canonical" href="https://quickgamez.com/games/guess-the-movie" />
</svelte:head>

<div class="flex flex-col overflow-auto min-h-dvh max-h-dvh">
	<header class="flex sticky top-0 z-10">
		<TopNav />
	</header>

	<section aria-labelledby="featured-games-heading" class="p-2">
		<h1
			id="featured-games-heading"
			class="text-2xl font-bold text-center border-b-2 border-black w-fit mx-auto mb-4"
		>
			Guess the Movie
		</h1>
		<div class="grid grid-cols-2 gap-2">
			{#each games as game}
				<article
					class="flex flex-col rounded-md shadow-sm overflow-clip bg-black"
					aria-labelledby={`game-title-${game.slug}`}
				>
					<a
						href={game.slug.length > 0 ? `/games/${game.slug}` : '#'}
						class="block aspect-square rounded-t-md overflow-hidden"
					>
						<img
							src={game.image}
							alt={`${game.title} game thumbnail`}
							class="w-full h-full object-cover"
						/>
					</a>
					<div class="flex flex-col px-1 pb-1 bg-black">
						<h2 id={`game-title-${game.slug}`} class="text-lg font-semibold text-neutral-200">
							{game.title}
						</h2>
						{#if game.slug.length > 0}
							<a
								href={`/games/${game.slug}`}
								class="bg-red-600 text-white font-bold text-center py-1 px-3 rounded-md mt-2"
								aria-label={`Play ${game.title} now`}
							>
								Play Now
							</a>
						{/if}
					</div>
				</article>
			{/each}
		</div>
		<p class="text-base text-gray-800 mt-2">
			Looking for a fun and challenging way to test your movie knowledge? Guess The Movie is the
			ultimate movie trivia game where you have to guess the name of the movie before time runs out
			— and before you lose all your lives! Whether you're a fan of Bollywood blockbusters or
			Hollywood classics, this game has something for everyone. Climb the leaderboard and show off
			your movie knowledge with friends and family. Ready to put your movie knowledge to the test?
			Let's play!
		</p>
	</section>
	<Footer />
</div>
