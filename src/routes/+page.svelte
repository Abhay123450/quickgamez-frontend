<script>
	import TopNav from '$lib/components/common/TopNav.svelte';
	import { homePageSchema } from './homePageSchema';

	// Dummy data or fetch it from a store/api
	let games = [
		{
			id: 1,
			title: 'Guess The Movie - Hollywood',
			image: '/images/guess-the-movie-logo.webp',
			slug: 'guess-the-movie'
		},
		{
			id: 2,
			title: 'More Games Coming Soon',
			image: '/images/coming-soon.webp',
			slug: ''
		}
	];
</script>

<svelte:head>
	<title>QuickGamez - Play online games for free</title>
	<meta
		name="description"
		content="Play free online games at QuickGamez! Enjoy hours of fun without any downloads or sign-ups. Start playing now!"
	/>

	{@html `<script type="application/ld+json">${JSON.stringify(homePageSchema)}</script>`}
</svelte:head>

<div class="flex flex-col overflow-auto max-h-lvh scrollbar-thin">
	<div class="flex sticky top-0">
		<TopNav />
	</div>

	<h1 class="text-2xl font-bold self-center border-b-2 border-black w-fit">Featured Games</h1>
	<div class="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2 p-2">
		{#each games as game}
			<a href={game.slug.length > 0 ? `/games/${game.slug}` : ''} class="flex flex-col">
				<div class="aspect-square bg-white rounded-t-md overflow-clip">
					<img src={game.image} alt={game.title + ' image'} class="w-full h-full object-cover" />
				</div>
				<div class="flex flex-col bg-white rounded-b-md px-1 pb-1">
					<h2 class="text-lg font-semibold">{game.title}</h2>
					{#if game.slug.length > 0}
						<button
							type="button"
							class="bg-red-600 w-full text-white font-bold py-1 px-3 rounded-md"
						>
							Play Now
						</button>
					{/if}
				</div>
			</a>
		{/each}
	</div>
	<h2 class=" font-sans text-2xl font-semibold text-gray-800 p-2">Play online games for free</h2>
	<p class="text-lg p-2">
		Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero impedit porro inventore
		accusantium, omnis debitis consectetur commodi et voluptatibus earum perspiciatis tenetur
		temporibus, accusamus laboriosam est voluptates consequuntur, nemo id! Lorem ipsum dolor sit
		amet consectetur adipisicing elit. Cupiditate praesentium, obcaecati ipsa nihil maxime ullam est
		sed ipsum, nemo aliquam, sapiente ipsam quis consequatur commodi eum id reprehenderit molestiae
		similique. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero impedit porro
		inventore accusantium, omnis debitis consectetur commodi et voluptatibus earum perspiciatis
		tenetur temporibus, accusamus laboriosam est voluptates consequuntur, nemo id! Lorem ipsum dolor
		sit amet consectetur adipisicing elit. Cupiditate praesentium, obcaecati ipsa nihil maxime ullam
		est sed ipsum, nemo aliquam, sapiente ipsam quis consequatur commodi eum id reprehenderit
		molestiae similique.
	</p>
</div>
