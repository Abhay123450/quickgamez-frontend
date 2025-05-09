<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { isLeftPanelOpen, isRightPanelOpen } from '../../../routes/stores';
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemMenuUnfold3Line2, RiSystemMenuFold3Line2 } from 'svelte-icons-pack/ri';

	export let isShowImage: boolean = true;
	export let title: string = 'QuickGamez.com';

	function openLeftPanel() {
		pushState('', { ...$page.state, isLeftPanelOpen: true });
	}

	function openRightPanel() {
		pushState('', { ...$page.state, isRightPanelOpen: true });
	}
</script>

<div
	class="flex flex-row w-full h-fit justify-between rounded-md rounded-t-none border border-gray-300 bg-white xl:hidden"
>
	<button
		name="openLeftPanel"
		class="w-9 h-9 m-1 p-1 rounded bg-white text-black uppercase border border-black xl:invisible"
		aria-label="Open left panel"
		on:click={openLeftPanel}
	>
		<Icon src={RiSystemMenuUnfold3Line2} size="24" />
	</button>
	{#if isShowImage}
		<a href="/">
			<img
				class="w-40 h-[74px] self-center xl:hidden mix-blend-multiply"
				srcset="/images/logo/logo768.webp 1x, /images/logo/logo1024.webp 2x, /images/logo/logo1200.webp 3x, /images/logo/logo1600.webp 4x"
				alt="logo"
				loading="lazy"
			/>
		</a>
	{:else}
		<h1 class="text-base sm:text-lg md:text-xl font-semibold self-center">{title}</h1>
	{/if}
	<button
		name="openRightPanel"
		on:click={openRightPanel}
		class="w-9 h-9 m-1 p-1 rounded bg-white text-black uppercase border border-black lg:invisible"
		aria-label="Open right panel"
	>
		<Icon src={RiSystemMenuFold3Line2} size="24" />
	</button>
</div>
