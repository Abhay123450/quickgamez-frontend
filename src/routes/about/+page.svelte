<script lang="ts">
	import Footer from '$lib/components/common/Footer.svelte';
	import TopNav from '$lib/components/common/TopNav.svelte';
</script>

<svelte:head>
	<title>QuickGamez | About the website</title>
	<meta name="description" content="Know about the website and the developer behind the website." />
	<link rel="canonical" href="https://quickgamez.com/about" />
</svelte:head>

<section class="flex flex-col overflow-auto min-h-dvh max-h-dvh">
	<header class="flex sticky top-0 z-10">
		<TopNav />
	</header>
	<h1 class="text-xl font-bold text-center m-4">About Website</h1>
	<p class="px-3 py-2">
		Welcome to QuickGamez.com, where you can play free online games anytime! Currently, there are
		two exciting games available: <a class="text-red-700" href="/games/guess-the-movie/hollywood"
			>Guess The Movie - Hollywood</a
		>
		and
		<a class="text-red-700" href="/games/guess-the-movie/bollywood">Guess The Movie - Bollywood</a>.
		This is just the beginning—many more games are in the works and will be coming soon. Stay tuned
		for new releases and updates. Don't forget to bookmark the site so you can easily check back for
		the latest fun additions!
	</p>
	<h1 class="text-xl font-bold text-center m-4">About Developer</h1>
	<p class="px-3 py-2">
		Hi there! My name is Abhay Anand. I am a software developer and I love developing fun and
		interesting projects. This website is a passion project of mine that I'm working on solo in my
		spare time. Feel free to contact me for any queries or suggestions. Email: <span
			class=" bg-white p-1 rounded-md">er.abhay.gkp@gmail.com</span
		>
	</p>
	<div class="flex flex-col grow"></div>
	<Footer />
</section>
