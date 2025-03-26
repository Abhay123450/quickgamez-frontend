<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import MiniWindow from './MiniWindow.svelte';
	import NotificationWindow from './NotificationWindow.svelte';
	import MyAccountWindow from './MyAccountWindow.svelte';
	import { isMyAccountWindowOpen, isNotificationWindowOpen } from '../../routes/stores';
	import { IoNotificationsSharp } from 'svelte-icons-pack/io';
	import { BsPersonCircle } from 'svelte-icons-pack/bs';
	import { AiFillAccountBook } from 'svelte-icons-pack/ai';

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

	onMount(() => {
		$isNotificationWindowOpen = true;
		$isMyAccountWindowOpen = true;
	});
</script>

<div
	bind:this={parent}
	bind:clientHeight={parentHeight}
	class="flex flex-col w-full h-dvh max-h-dvh overflow-hidden"
>
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
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
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
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
	<div class="flex flex-col min-h-8 h-fit max-h-fit max-h-fit-firefox overflow-y-auto flex-1">
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
	</div>

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
