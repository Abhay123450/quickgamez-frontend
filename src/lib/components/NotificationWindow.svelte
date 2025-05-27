<script lang="ts">
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import LoadingSpin from './common/LoadingSpin.svelte';
	import { onMount } from 'svelte';
	import { isLoggedIn, isNewNotificationAvailable, userDetails } from '../../routes/stores';
	import { API_ROUTES } from '$lib/constants/apiRoutes';

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
		const url = new URL(API_ROUTES.NOTIFICATIONS.GET_RECENT());
		const [error, data] = await fetchWithTokenRefresh<Notification[]>(url, request);

		if (error) {
			isLoading = false;
			return [];
		}

		saveNotificationsToCache(data);
		if (data && data.length > 0) {
			data.forEach((notification) => {
				if (!notification.isRead) {
					$isNewNotificationAvailable = true;
				}
			});
		}
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
		const url = new URL(API_ROUTES.NOTIFICATIONS.MARK_AS_READ(notificationId));
		const [error, data] = await fetchWithTokenRefresh(url, request);

		if (error) {
			return;
		}

		notifications = notifications.map((notification) => {
			if (notification.notificationId === notificationId) {
				notification.isRead = true;
			}
			return notification;
		});
		saveNotificationsToCache(notifications);

		notifications.forEach((notification) => {
			if (!notification.isRead) {
				$isNewNotificationAvailable = true;
			}
		});
	}

	async function getNotifications(): Promise<Notification[]> {
		const notificationsFromCache = getNotificationsFromCache();
		if (notificationsFromCache) {
			notifications = notificationsFromCache;
			isLoading = false;
			return notifications;
		}
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
				href={notification.action === NotificationActions.OPEN_PROFILE ? `/users/profile/me` : ''}
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
					class="absolute right-2 justify self-center w-2 h-2 rounded-full bg-red-600"
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
