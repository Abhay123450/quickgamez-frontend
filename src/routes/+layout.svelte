<script lang="ts">
	import '../app.css';
	import { fade, fly } from 'svelte/transition';
	import { theme, isLeftPanelOpen, toasts } from './stores';
	import { trapFocus } from '$lib/actions';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';
	import HomePageOptions from './HomePageOptions.svelte';
	import { Theme } from '$lib/constants/theme.enum';
	// import SideNav from '$lib/components/nav/SideNav.svelte';
	// let isLeftCollapsed = isLeftPanelOpen.subscribe;

	// isLeftPanelOpen.subscribe((isOpen) => {
	// 	isLeftCollapsed = !isOpen;
	// 	isLeftCollapsed = isLeftCollapsed;
	// });

	function toggleLeft() {
		isLeftPanelOpen.update((isOpen) => !isOpen);
	}
</script>

<div class="min-h-screen w-full flex flex-col lg:flex-row lg:justify-center">
	<!-- Left Section-->
	<div
		class="fixed left-0 top-0 h-lvh max-h-lvh w-full bg-transparent max-w-xl
		flex flex-row z-10 lg:flex lg:bg-white lg:static lg:basis-1/4 xl:basis-1/5
		{$theme === Theme.Dark ? 'bg-gray-800 text-neutral-200' : 'bg-white text-black'} bg-gray-200"
		class:hidden={!$isLeftPanelOpen}
	>
		<div class="flex flex-col basis-11/12 lg:basis-full bg-white h-lvh">
			<a class="self-center" href="/">
				<img class="w-48 h-auto" src="/images/logo.webp" alt="logo" />
			</a>
			<HomePageOptions />
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- clicking outside left panel will close the left panel -->
		<div class="flex flex-col basis-1/12 w-full lg:hidden h-full" on:click={toggleLeft}>
			<button class="w-full h-auto bg-white opacity-100">
				<img class="w-full h-auto" src="/icons/cross_icon.svg" alt="close" />
			</button>
			<div class="w-full h-full bg-black opacity-50">
				<!-- <img class="" src="/icons/cross_icon.svg" alt="close" /> -->
			</div>
		</div>
	</div>

	<!-- Middle Section -->
	<main
		class="w-full min-h-lvh h-lvh max-h-lvh lg:basis-3/4 xl:basis-3/5 flex flex-col bg-yellow-100"
	>
		<!-- <nav class="flex flex-row w-full bg-white">
			<div class="flex place-items-end">
				<i class="flex w-9 h-9 bg-white">
					<button on:click={toggleLeft}><img src="/icons/menu_icon.svg" alt="menu" /></button>
				</i>
				<i class="flex w-9 h-9 bg-white">
					<a href="/"> <button><img src="/icons/home_icon.svg" alt="menu" /></button></a>
				</i>
			</div>

			<p>Home Page</p>
		</nav> -->
		<ToastContainer />
		<slot />
	</main>

	<!-- Right Section -->
	<div class="hidden xl:basis-1/5 xl:flex xl:w-full h-lvh max-h-lvh bg-white">
		<div>
			<!-- <p class="text-center text-gray-600">Right Section</p> -->
		</div>
	</div>
</div>
