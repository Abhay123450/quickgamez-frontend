<script lang="ts">
	import { onMount } from 'svelte';
	import MiniWindow from './MiniWindow.svelte';
	import NotificationWindow from './NotificationWindow.svelte';
	import MyAccountWindow from './MyAccountWindow.svelte';
	import { isMyAccountWindowOpen, isNotificationWindowOpen } from '../../routes/stores';
	import { IoNotificationsSharp } from 'svelte-icons-pack/io';
	import { BsPersonCircle } from 'svelte-icons-pack/bs';

	let parent: HTMLDivElement;
	// let screenHeight: number;
	// let childCount: number;
	// let childHeight: number;

	// onMount(() => {
	// 	screenHeight = window.innerHeight;
	// 	childCount = parent.children.length;
	// 	console.log('child count', childCount);
	// });

	onMount(() => {
		$isNotificationWindowOpen = true;
		$isMyAccountWindowOpen = true;
	});
</script>

<div bind:this={parent} class="flex flex-col w-full h-dvh max-h-dvh overflow-hidden">
	<div
		class="flex flex-col min-h-8 h-auto max-h-fit overflow-y-auto"
		class:flex-1={$isMyAccountWindowOpen}
	>
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
	<div
		class="flex flex-col min-h-8 h-fit max-h-fit overflow-y-auto"
		class:flex-1={$isNotificationWindowOpen}
	>
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
	<div
		class="flex flex-col min-h-8 h-fit max-h-fit overflow-y-auto"
		class:flex-1={$isNotificationWindowOpen}
	>
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

	<!-- <div class="flex flex-col flex-1 shrink min-h-8 h-fit overflow-y-auto">
		<NotificationWindow />
	</div>
	<div class="flex flex-col flex-1 shrink min-h-8 h-fit overflow-y-auto">
		<NotificationWindow />
	</div> -->
</div>
