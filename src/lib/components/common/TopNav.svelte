<script lang="ts">
	import { isLeftPanelOpen, isRightPanelOpen } from '../../../routes/stores';
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemMenuUnfold3Line2, RiSystemMenuFold3Line2 } from 'svelte-icons-pack/ri';

	export let isShowImage: boolean = true;
	export let title: string = 'QuickGamez.com';

	function toggleLeftPanel() {
		isLeftPanelOpen.update((isOpen) => !isOpen);
	}

	function toggleRightPanel() {
		isRightPanelOpen.update((isOpen) => !isOpen);
	}
</script>

<div
	class="flex flex-row w-full h-fit justify-between rounded-md rounded-t-none border border-gray-300 bg-white xl:hidden"
>
	<button
		on:click={toggleLeftPanel}
		class="w-9 h-9 m-1 p-1 rounded bg-white text-black uppercase border border-black lg:invisible"
		aria-label="Toggle left panel"
	>
		<Icon src={RiSystemMenuUnfold3Line2} size="24" />
	</button>
	{#if isShowImage}
		<a href="/">
			<img class="w-40 self-center lg:hidden" src="/images/logo.webp" alt="logo" />
		</a>
	{:else}
		<h1 class="text-xl font-semibold self-center">{title}</h1>
	{/if}
	<button
		on:click={toggleRightPanel}
		class="w-9 h-9 m-1 p-1 rounded bg-white text-black uppercase border border-black xl:invisible"
		aria-label="Toggle right panel"
	>
		<Icon src={RiSystemMenuFold3Line2} size="24" />
	</button>
</div>
