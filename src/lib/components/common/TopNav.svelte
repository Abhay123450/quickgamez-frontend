<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemMenuUnfold3Line2, RiSystemMenuFold3Line2 } from 'svelte-icons-pack/ri';
	import logo480 from '$lib/assets/images/logo/logo480.webp';
	import logo768 from '$lib/assets/images/logo/logo768.webp';
	import logo1024 from '$lib/assets/images/logo/logo1024.webp';
	import logo1200 from '$lib/assets/images/logo/logo1200.webp';
	import logo1600 from '$lib/assets/images/logo/logo1600.webp';
	import { isNewNotificationAvailable } from '../../../routes/stores';

	/**
	 * Whether to show the logo or not.
	 * If false, title will be shown
	 * @type boolean
	 * @default true
	 */
	export let isShowImage: boolean = true;
	/**
	 * Title shown in the top nav bar.
	 * Effective when isShowImage is false
	 * @type string
	 * @default QuickGamez.com
	 */
	export let title: string = 'QuickGamez.com';
	/**
	 * Is the title a h1 tag, if false it will be a p tag.
	 * Effective when isShowImage is false
	 * @type boolean
	 * @default true
	 */
	export let isH1Tag: boolean = true;

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
				srcset="{logo480} 0.63x, {logo768} 1x, {logo1024} 1.33x, {logo1200} 1.56x, {logo1600} 2.08x"
				src={logo1600}
				alt="logo"
				loading="lazy"
			/>
		</a>
	{:else if isH1Tag}
		<h1 class="text-base sm:text-lg md:text-xl font-semibold self-center">{title}</h1>
	{:else}
		<p class="text-base sm:text-lg md:text-xl font-semibold self-center">{title}</p>
	{/if}
	<button
		name="openRightPanel"
		on:click={openRightPanel}
		class="relative w-9 h-9 m-1 p-1 rounded bg-white text-black uppercase border border-black lg:invisible"
		aria-label="Open right panel"
	>
		<Icon src={RiSystemMenuFold3Line2} size="24" />
		<div
			class:hidden={!$isNewNotificationAvailable}
			class="absolute w-2 h-2 bg-red-600 rounded-full top-0.5 left-0.5"
		></div>
	</button>
</div>
