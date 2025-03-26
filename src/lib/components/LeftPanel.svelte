<script lang="ts">
	import MiniWindow from './MiniWindow.svelte';
	import { IoSettingsOutline, IoGameControllerOutline, IoHome } from 'svelte-icons-pack/io';
	import SiteSettings from './SiteSettings.svelte';
	import SideNav from './SideNav.svelte';
	import Games from './Games.svelte';
	import { onMount } from 'svelte';
	import {
		isSideNavWindowOpen,
		isGamesNavWindowOpen,
		isSettingsWindowOpen
	} from '../../routes/stores';

	let parent: HTMLDivElement;
	// let isSideNavWindowOpen: boolean = $isSideNavWindowOpen;
	// let isSiteSettingsWindowOpen: boolean = false;
	// let isGamesNavWindowOpen: boolean = false;

	onMount(() => {
		$isSideNavWindowOpen = true;
		$isSettingsWindowOpen = true;
		$isGamesNavWindowOpen = true;
	});
</script>

<div
	bind:this={parent}
	class="flex flex-col w-full h-dvh max-h-dvh overflow-y-auto bg-white dark:bg-neutral-800"
>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
		<MiniWindow
			isMaximized={$isSideNavWindowOpen}
			title="QuickGamez.com"
			icon={IoHome}
			on:maximize={() => {
				$isSideNavWindowOpen = true;
			}}
			on:minimize={() => {
				$isSideNavWindowOpen = false;
			}}
		>
			<!-- <Games /> -->
			<SideNav />
		</MiniWindow>
	</div>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
		<MiniWindow
			isMaximized={$isGamesNavWindowOpen}
			title="Games"
			icon={IoGameControllerOutline}
			on:maximize={() => {
				$isGamesNavWindowOpen = true;
			}}
			on:minimize={() => {
				$isGamesNavWindowOpen = false;
			}}
		>
			<Games />
		</MiniWindow>
	</div>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
		<MiniWindow
			title="Site Settings"
			icon={IoSettingsOutline}
			isMaximized={$isSettingsWindowOpen}
			on:maximize={() => {
				$isSettingsWindowOpen = true;
			}}
			on:minimize={() => {
				$isSettingsWindowOpen = false;
			}}
		>
			<SiteSettings />
		</MiniWindow>
	</div>
</div>

<style>
	.max-h-fit-firefox {
		max-height: fit-content;
		max-height: -moz-fit-content;
	}
</style>
