<script lang="ts">
	import TopNav from '$lib/components/common/TopNav.svelte';
</script>

<svelte:head>
	<title>QuickGamez | About the website</title>
	<meta name="description" content="Know about the website and the developer behind the website." />
</svelte:head>

<div class="flex flex-col">
	<TopNav />
	<h1 class="text-xl font-bold text-center m-4">About Website</h1>
	<p class="px-3 py-2">
		Welcome to QuickGamez.com, where you can play free online games anytime! Currently, there is one
		exciting game available: <a class="text-orange-500" href="/games/guess-the-movie"
			>Guess The Movie</a
		>. This is just the beginning—many more games are in the works and will be coming soon. Stay
		tuned for new releases and updates. Don't forget to bookmark the site so you can easily check
		back for the latest fun additions!
	</p>
	<h1 class="text-xl font-bold text-center m-4">About Developer</h1>
	<p class="px-3 py-2">
		Hi there! My name is Abhay Anand. I am a software developer and I love developing fun and
		interesting projects. This website is a passion project of mine that I'm working on solo in my
		spare time. Feel free to contact me for any queries or suggestions. Email: <span
			class=" bg-white p-1 rounded-md">er.abhay.gkp@gmail.com</span
		>
	</p>
</div>
