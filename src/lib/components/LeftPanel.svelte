<script lang="ts">
	import MiniWindow from './MiniWindow.svelte';
	import { IoSettingsOutline, IoGameControllerOutline, IoHome } from 'svelte-icons-pack/io';
	import SiteSettings from './SiteSettings.svelte';
	import SideNav from './SideNav.svelte';
	import Games from './Games.svelte';
	import { beforeUpdate, onMount } from 'svelte';
	import {
		isSideNavWindowOpen,
		isGamesNavWindowOpen,
		isSettingsWindowOpen
	} from '../../routes/stores';
	import { throttle } from '$lib/utils/throttle';

	let parent: HTMLDivElement;

	function updateFlexClasses() {
		if (!parent) return;
		const WINDOW_HEADER_HEIGHT = 32;
		const children = Array.from(parent.children) as HTMLElement[];

		const windowBodies = Array.from(
			parent.querySelectorAll<HTMLElement>('.window-body:not(.hidden)')
		) as HTMLElement[];
		const totalHeight = windowBodies.reduce((sum, el) => sum + el.scrollHeight + 32, 0);
		const parentHeight = parent.clientHeight;

		const miniWindowContainers = Array.from(parent.children) as HTMLElement[];

		miniWindowContainers.forEach((el) => {
			let windowBody = el.querySelector('.window-body') as HTMLElement;
			if (!windowBody) return;
			let shouldFlex =
				windowBody.scrollHeight >
				(parentHeight - WINDOW_HEADER_HEIGHT * miniWindowContainers.length) /
					parent.children.length;
			el.classList.toggle('flex-1', shouldFlex);
		});
	}

	onMount(() => {
		updateFlexClasses();
		window.addEventListener('resize', throttle(updateFlexClasses, 100));

		return () => {
			window.removeEventListener('resize', updateFlexClasses);
		};
	});

	beforeUpdate(() => {
		updateFlexClasses();
	});
</script>

<div
	bind:this={parent}
	class="flex flex-col w-full h-dvh max-h-dvh overflow-y-auto bg-white dark:bg-neutral-800"
>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto">
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
			<SideNav />
		</MiniWindow>
	</div>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto">
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
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto">
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
