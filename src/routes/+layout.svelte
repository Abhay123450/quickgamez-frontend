<script lang="ts">
	import '../app.css';
	import { fade, fly } from 'svelte/transition';
	import { theme, isGameInProgess } from './stores';
	import { trapFocus } from '$lib/actions';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';
	import { Theme } from '$lib/constants/theme.enum';
	import SignIn from '$lib/components/SignIn/SignIn.svelte';
	import RightPanel from '$lib/components/RightPanel.svelte';
	import LeftPanel from '$lib/components/LeftPanel.svelte';
	import { onMount } from 'svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { goto, pushState, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { Icon } from 'svelte-icons-pack';
	import { IoClose } from 'svelte-icons-pack/io';
	import CookiePolicy from '$lib/components/CookiePolicy.svelte';

	let href = '';

	onMount(() => {
		function handleLinkClick(e: MouseEvent) {
			const target = e.target as HTMLElement;
			const anchor = target.closest('a');

			if (anchor && $isGameInProgess) {
				e.preventDefault();
				e.stopPropagation();

				const linkHref = anchor.getAttribute('href') || '';

				// Use setTimeout to ensure this runs after other handlers
				setTimeout(() => {
					href = linkHref;
					pushState('', { showPageNavigationDialog: true });
				}, 0);

				return false; // Also return false for good measure
			}
		}

		// Use capture phase to ensure this runs before other handlers
		document.addEventListener('click', handleLinkClick, true);

		// Clean up on component destruction
		return () => {
			document.removeEventListener('click', handleLinkClick, true);
		};
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="min-h-dvh w-full flex flex-col lg:flex-row lg:justify-center">
	<!-- Left Section-->
	{#key $page.state.isLeftPanelOpen}
		<div
			class="fixed left-0 top-0 min-h-dvh h-dvh max-h-dvh w-full bg-transparent flex flex-row z-40 xl:z-0 xl:flex xl:bg-white xl:static xl:w-1/5
				{$theme === Theme.Dark ? 'bg-gray-800 text-neutral-200' : 'bg-transparent text-black'} bg-gray-200"
			class:hidden={!$page.state.isLeftPanelOpen}
			use:trapFocus
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- clicking outside left panel will close the left panel -->
			<div
				class="flex flex-row w-full h-full bg-black bg-opacity-50 xl:place-content-end"
				in:fade={{ duration: 300 }}
				out:fade={{ duration: 300 }}
			>
				<div
					class="flex flex-col flex-shrink-0 w-11/12 max-w-md xl:w-full bg-white h-full overflow-auto scrollbar-thin"
					in:fly={{ x: -500, duration: 300 }}
					out:fly={{ x: -500, duration: 300 }}
				>
					<LeftPanel />
				</div>
				<div
					class="flex flex-col w-full xl:hidden h-full cursor-pointer"
					on:click|stopPropagation={() => {
						history.back();
						console.log('poping', history.state);
					}}
				>
					<button
						class="w-full h-auto max-w-10 bg-white opacity-100 text-black"
						in:fly={{ y: -50, duration: 300 }}
						out:fly={{ y: -50, duration: 300 }}
						aria-label="Close"
					>
						<Icon src={IoClose} className="w-full h-auto" />
					</button>
				</div>
			</div>
		</div>
	{/key}

	<!-- Middle Section (main content) -->
	<main class="w-full min-h-dvh h-dvh max-h-dvh lg:w-3/4 xl:w-3/5 flex flex-col bg-yellow-100">
		<slot />
		<ToastContainer />
	</main>

	<!-- Right Section-->
	{#key $page.state.isRightPanelOpen}
		<div
			class="fixed right-0 top-0 h-dvh max-h-dvh w-full bg-transparent flex flex-col z-40 lg:z-0 lg:flex lg:bg-white lg:static lg:w-1/4 xl:w-1/5
				{$theme === Theme.Dark ? 'bg-gray-800 text-neutral-200' : 'bg-transparent text-black'} bg-gray-200"
			class:hidden={!$page.state.isRightPanelOpen}
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- clicking outside right panel will close the right panel -->
			<div
				class="flex flex-row-reverse lg:flex-row w-full h-full max-h-full bg-black bg-opacity-50"
				in:fade={{ duration: 300 }}
				out:fade={{ duration: 300 }}
			>
				<div
					class="flex flex-col flex-shrink-0 w-11/12 lg:w-full max-w-md bg-white h-full max-h-full border-r border-gray-400"
					in:fly={{ x: 500, duration: 300 }}
					out:fly={{ x: 500, duration: 300 }}
				>
					<!-- content -->
					<RightPanel />
				</div>
				<div
					class="flex flex-col w-full lg:hidden h-full cursor-pointer"
					on:click|stopPropagation={() => history.back()}
				>
					<button
						class="w-full h-auto max-w-10 bg-white opacity-100 place-self-end text-black"
						in:fly={{ y: -50, duration: 300 }}
						out:fly={{ y: -50, duration: 300 }}
					>
						<Icon src={IoClose} className="w-full h-auto" />
					</button>
				</div>
			</div>
		</div>
	{/key}
	<!-- Login Modal -->
	{#if $page.state.isLoginPanelOpen}
		<SignIn />
	{/if}

	{#if $page.state.showPageNavigationDialog}
		<Dialog
			title="Confirm Navigation"
			message="Are you sure you want to navigate away from this page?"
			isCancellable={true}
			callbackFunctionPositive={() => {
				replaceState('', { showPageNavigationDialog: false });
				goto(href);
			}}
		/>
	{/if}

	<CookiePolicy />
</div>
