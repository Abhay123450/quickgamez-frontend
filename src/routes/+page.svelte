<script>
	import Footer from '$lib/components/common/Footer.svelte';
	import TopNav from '$lib/components/common/TopNav.svelte';
	import LdTag from '$lib/jsonld/LDTag.svelte';
	import { homePageSchema } from './homePageSchema';

	// Dummy data or fetch it from a store/api
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
		content="Play free online games at QuickGamez! Enjoy hours of fun on your mobile, tablet, or computer without any downloads or sign-ups. Start playing now!"
	/>
	<LdTag schema={homePageSchema} />
	<link rel="canonical" href="https://quickgamez.com" />
</svelte:head>

<div class="flex flex-col overflow-auto max-h-dvh">
	<header class="flex sticky top-0 z-10">
		<TopNav />
	</header>

	<section aria-labelledby="featured-games-heading" class="p-2">
		<h1
			id="featured-games-heading"
			class="text-2xl font-bold text-center border-b-2 border-black w-fit mx-auto mb-4"
		>
			Featured Games
		</h1>
		<div class="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
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
					<div class="flex flex-col px-1 pb-1 bg-white">
						<h2 id={`game-title-${game.slug}`} class="text-lg font-semibold text-black">
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
	</section>

	<section class="p-2" aria-labelledby="about-heading">
		<h2 id="about-heading" class="text-xl font-semibold text-gray-900 mb-2">
			Play Free Online Games - Fun, Fast & On Any Device!
		</h2>
		<p class="text-base text-gray-800">
			Welcome to QuickGamez.com, your go-to hub for exciting and free online games! Whether you're
			at home or on the move, our mobile - friendly platform lets you enjoy gaming anywhere - on
			your PC, tablet, or mobile phone. No downloads or installations needed - just tap, click, and
			play.
		</p>
	</section>

	<section class="p-2 space-y-4" aria-labelledby="features-heading">
		<h2 id="features-heading" class="text-xl font-semibold text-gray-900">
			Why You'll Love Playing Here
		</h2>

		<article>
			<h3 class="text-lg font-semibold text-gray-800">🎮 Play on Any Device</h3>
			<p class="text-base text-gray-800">
				Our games are optimized for all screen sizes and browsers. Whether you're using Android,
				iOS, Windows, or macOS, you'll enjoy a smooth and responsive gaming experience.
			</p>
		</article>

		<article>
			<h3 class="text-lg font-semibold text-gray-800">🏆 Leaderboards for Every Game</h3>
			<p class="text-base text-gray-800">
				Think you’ve got what it takes to be the best? Compete with players around the world and
				climb the live leaderboards. Track your score, improve your ranking, and show off your
				skills to the community.
			</p>
		</article>

		<article>
			<h3 class="text-lg font-semibold text-gray-800">💬 Comment and Connect</h3>
			<p class="text-base text-gray-800">
				Each game features a comments section where you can share tips, ask questions, or simply
				join the conversation. Connect with fellow players and be part of a growing gaming
				community.
			</p>
		</article>
	</section>

	<section class="p-2" aria-labelledby="collection-heading">
		<h2
			id="collection-heading"
			class="text-xl font-semibold text-gray-900 underline underline-offset-4 mb-2"
		>
			Current Game Collection
		</h2>
		<p class="text-base text-gray-800 mb-2">Our current lineup features two engaging titles:</p>
		<ul class="list-disc pl-6 bg-white rounded-md py-2">
			<li>
				<a href="/games/guess-the-movie/hollywood" class="text-red-600 font-semibold"
					>Guess The Movie – Hollywood</a
				>
				<p class="text-base text-gray-800">
					Test your knowledge of Hollywood films in this fun guessing game.
				</p>
			</li>
			<li>
				<a href="/games/guess-the-movie/bollywood" class="text-red-600 font-semibold"
					>Guess The Movie – Bollywood</a
				>
				<p class="text-base text-gray-800">
					Love Hindi movies? Try to guess the movie titles based on clues and challenge your memory.
				</p>
			</li>
		</ul>
		<p class="text-base text-gray-800 mt-2">
			And this is just the beginning! We're constantly working on adding more unique and
			entertaining games to our platform. Stay tuned for upcoming releases!
		</p>
	</section>

	<Footer />
</div>
