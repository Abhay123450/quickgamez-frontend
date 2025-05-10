<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { IoNotificationsOutline, IoNotificationsSharp } from 'svelte-icons-pack/io';
	import { IoNotificationsCircleOutline } from 'svelte-icons-pack/io';
	import MiniWindow from './MiniWindow.svelte';
	import { page } from '$app/stores';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import LoadingSpin from './common/LoadingSpin.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isLoggedIn, userDetails } from '../../routes/stores';

	const NotificationActions = {
		OPEN_PROFILE: 'open_profile',
		OPEN_COMMENT: 'open_comment'
	} as const;

	type NotificationAction = (typeof NotificationActions)[keyof typeof NotificationActions];

	interface Notification {
		notificationId: string;
		userId: string;
		message: string;
		action: NotificationAction;
		payload: any | null | undefined;
		type: 'normal' | 'important';
		isRead: boolean;
		createdAt: Date;
		updatedAt: Date;
	}

	let notifications: Notification[] = [];
	let isLoading = true;

	async function fetchNotifications(): Promise<Notification[]> {
		isLoading = true;
		const request: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const url = new URL(
			`http://${$page.url.hostname}:4000/api/v1/notifications/recent?page=1&limit=20`
		);
		const [error, data] = await fetchWithTokenRefresh<Notification[]>(url, request);

		if (error) {
			console.error(`error fetching unread notifications ${JSON.stringify(error)}`);
			isLoading = false;
			return [];
		}

		console.log(`notifications ${JSON.stringify(data)}`);

		saveNotificationsToCache(data);
		isLoading = false;
		return data;
	}

	async function markNotificationAsRead(notificationId: string) {
		const request: RequestInit = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const url = new URL(
			`http://${$page.url.hostname}:4000/api/v1/notifications/${notificationId}/read`
		);
		const [error, data] = await fetchWithTokenRefresh(url, request);

		if (error) {
			console.error(`error fetching unread notifications ${JSON.stringify(error)}`);
			return;
		}

		console.log(`notificationsmarkasread ${JSON.stringify(data)}`);
	}

	async function getNotifications(): Promise<Notification[]> {
		const notificationsFromCache = getNotificationsFromCache();
		if (notificationsFromCache) {
			console.log('notifications from cache');
			notifications = notificationsFromCache;
			isLoading = false;
			return notifications;
		}
		console.log('notification cache miss');
		return await fetchNotifications();
	}

	function getNotificationsFromCache(): Notification[] | null {
		const key = `notifications-${$userDetails?.userId}`;
		const notifications = sessionStorage.getItem(key);
		if (notifications) {
			const notificationsObj = JSON.parse(notifications);
			if (notificationsObj && notificationsObj.updateTime - Date.now() <= 1 * 60 * 1000) {
				return notificationsObj.notifications as Notification[];
			}
		}
		return null;
	}

	function saveNotificationsToCache(notifications: Notification[]) {
		const key = `notifications-${$userDetails?.userId}`;
		let value = {
			notifications,
			updateTime: Date.now()
		};
		sessionStorage.setItem(key, JSON.stringify(value));
	}

	onMount(async () => {
		console.log('notification mounted');
		if ($isLoggedIn) {
			notifications = await getNotifications();
		} else {
			isLoading = false;
		}
	});
</script>

<div class="flex flex-col w-full h-auto bg-white rounded-b py-1 px-1 overflow-y-auto">
	{#if isLoading}
		<div class="h-8 bg-white flex justify-center">
			<LoadingSpin />
		</div>
	{:else if notifications && notifications.length > 0}
		<hr class="border-t border-neutral-400" />
		{#each notifications as notification}
			<a
				href={notification.action === NotificationActions.OPEN_PROFILE
					? `/users/profile/my-profile`
					: ''}
				type="button"
				class="relative flex w-full px-1.5 py-1 rounded-sm text-start {notification.isRead
					? 'bg-neutral-100 hover:bg-neutral-200'
					: 'bg-yellow-100 hover:bg-yellow-200'}"
				on:click={() => markNotificationAsRead(notification.notificationId)}
			>
				<p>
					{notification.message}
				</p>

				<div
					class="absolute right-2 justify self-center w-2 h-2 rounded-full bg-yellow-600"
					class:hidden={notification.isRead}
				></div>
			</a>
			<hr class="border-t border-neutral-400" />
		{/each}
	{:else if notifications && notifications.length === 0}
		<div class="flex flex-col w-full h-full justify-center items-center">
			<p class="text-neutral-600">No notifications</p>
		</div>
	{/if}
</div>
