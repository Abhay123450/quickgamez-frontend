<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import MiniWindow from './MiniWindow.svelte';
	import NotificationWindow from './NotificationWindow.svelte';
	import MyAccountWindow from './MyAccountWindow.svelte';
	import {
		isMyAccountWindowOpen,
		isNotificationWindowOpen,
		showGameLog
	} from '../../routes/stores';
	import { IoNotificationsSharp } from 'svelte-icons-pack/io';
	import { BsPersonCircle } from 'svelte-icons-pack/bs';
	import { throttle } from '$lib/utils/throttle';
	import GameLog from './GameLog.svelte';

	let parent: HTMLDivElement;

	function updateFlexClasses() {
		if (!parent) return;

		const windowBodies = Array.from(
			parent.querySelectorAll<HTMLElement>('.window-body:not(.hidden)')
		) as HTMLElement[];
		console.log('windowBodies', windowBodies);
		const parentHeight = parent.clientHeight;

		const miniWindowContainers = Array.from(parent.children) as HTMLElement[];

		miniWindowContainers.forEach((el) => {
			let windowBody = el.querySelector('.window-body') as HTMLElement;
			if (!windowBody) return;
			let shouldFlex =
				windowBody.scrollHeight >
				(parentHeight - 32 * miniWindowContainers.length) / miniWindowContainers.length;
			el.classList.toggle('flex-1', shouldFlex);
		});
	}

	onMount(() => {
		updateFlexClasses();
		window.addEventListener('resize', throttle(updateFlexClasses, 500));

		return () => {
			window.removeEventListener('resize', updateFlexClasses);
		};
	});

	beforeUpdate(() => {
		updateFlexClasses();
	});
</script>

<div bind:this={parent} class="flex flex-col w-full h-dvh max-h-dvh overflow-y-auto">
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto">
		<MiniWindow
			isMaximized={$isMyAccountWindowOpen}
			title="My Account"
			icon={BsPersonCircle}
			on:maximize={() => {
				$isMyAccountWindowOpen = true;
			}}
			on:minimize={() => {
				$isMyAccountWindowOpen = false;
			}}
		>
			<MyAccountWindow />
		</MiniWindow>
	</div>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto">
		<MiniWindow
			isMaximized={$isNotificationWindowOpen}
			icon={IoNotificationsSharp}
			title="Notifications"
			on:maximize={() => {
				$isNotificationWindowOpen = true;
			}}
			on:minimize={() => {
				$isNotificationWindowOpen = false;
			}}
		>
			<NotificationWindow />
		</MiniWindow>
	</div>
	{#if $showGameLog}
		<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto">
			<MiniWindow isMaximized={true} icon={IoNotificationsSharp} title="Game Log">
				<GameLog />
			</MiniWindow>
		</div>
	{/if}
</div>

<style>
	.max-h-fit-firefox {
		/* max-height: fit-content; */
		max-height: -moz-fit-content;
	}
</style>
