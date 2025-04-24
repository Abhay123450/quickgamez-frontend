<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import MiniWindow from './MiniWindow.svelte';
	import NotificationWindow from './NotificationWindow.svelte';
	import MyAccountWindow from './MyAccountWindow.svelte';
	import { isMyAccountWindowOpen, isNotificationWindowOpen } from '../../routes/stores';
	import { IoNotificationsSharp } from 'svelte-icons-pack/io';
	import { BsPersonCircle } from 'svelte-icons-pack/bs';
	import { AiFillAccountBook } from 'svelte-icons-pack/ai';
	import { throttle } from '$lib/utils/throttle';

	let parent: HTMLDivElement;
	// let screenHeight: number;
	// let childCount: number;
	// let childHeight: number;
	let parentHeight: number;
	let accountWindowHeight: number;
	let notificationWindowHeight1: number;
	let notificationWindowHeight2: number;
	let perChildHeight: number;

	// onMount(() => {
	// 	screenHeight = window.innerHeight;
	// 	childCount = parent.children.length;
	// 	console.log('child count', childCount);
	// });

	function updateFlexClasses() {
		if (!parent) return;
		const children = Array.from(parent.children) as HTMLElement[];

		const windowBodies = Array.from(
			parent.querySelectorAll<HTMLElement>('.window-body:not(.hidden)')
		) as HTMLElement[];
		console.log('windowBodies', windowBodies);
		const totalHeight = windowBodies.reduce((sum, el) => sum + el.scrollHeight + 32, 0);
		const parentHeight = parent.clientHeight;
		console.log('totalHeight', totalHeight);
		console.log('parentHeight', parentHeight);

		const miniWindowContainers = Array.from(parent.children) as HTMLElement[];

		console.log('miniWindowContainers', miniWindowContainers);
		miniWindowContainers.forEach((el) => {
			let windowBody = el.querySelector('.window-body') as HTMLElement;
			console.log('windowBody', windowBody);
			if (!windowBody) return;
			console.log(
				`windowBody scrollHeight ${windowBody.scrollHeight} clientHeight ${windowBody.clientHeight}`
			);
			let shouldFlex =
				windowBody.scrollHeight > (parentHeight - 32 * miniWindowContainers.length) / 3;
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
			bind:clientHeight={accountWindowHeight}
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
			bind:clientHeight={notificationWindowHeight1}
		>
			<NotificationWindow />
		</MiniWindow>
	</div>
	<!-- <div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
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
			bind:clientHeight={notificationWindowHeight2}
		>
			<NotificationWindow />
		</MiniWindow>
	</div> -->

	<!-- <div class="flex flex-col flex-1 shrink min-h-8 h-fit overflow-y-auto">
		<NotificationWindow />
	</div>
	<div class="flex flex-col flex-1 shrink min-h-8 h-fit overflow-y-auto">
		<NotificationWindow />
	</div> -->
</div>

<style>
	.max-h-fit-firefox {
		/* max-height: fit-content; */
		max-height: -moz-fit-content;
	}
</style>
