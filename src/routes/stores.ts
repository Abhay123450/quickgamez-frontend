import { Theme } from '$lib/constants/theme.enum';
import type { Comment } from '$lib/types/Comment';
import type { User } from '$lib/types/User';
import { writable, type Writable } from 'svelte/store';

export let isLeftPanelOpen: Writable<boolean> = writable(false);
export let isRightPanelOpen: Writable<boolean> = writable(false);
export let theme: Writable<Theme> = writable(Theme.Default);

/** Left Panel Windows START*/
export let isSideNavWindowOpen: Writable<boolean> = writable(false);
export let isSettingsWindowOpen: Writable<boolean> = writable(false);
export let isGamesNavWindowOpen: Writable<boolean> = writable(false);
/** Left Panel END*/

/** Right Panel Windows START*/
export let isMyAccountWindowOpen: Writable<boolean> = writable(false);
export let isNotificationWindowOpen: Writable<boolean> = writable(false);
/** Right Panel END*/

/** TOAST START*/
export interface Toast {
	id: number;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error';
}

export const toasts = writable<Toast[]>([]);

export function addToast(
	message: string,
	type: 'info' | 'success' | 'warning' | 'error' = 'info',
	duration: number = 3000
) {
	const id = Math.random();
	toasts.update((all) => [{ id, message, type }, ...all]);

	setTimeout(() => {
		removeToast(id);
	}, duration);
}

export function removeToast(id: number) {
	toasts.update((all) => all.filter((toast) => toast.id !== id));
}
/** TOAST END*/

/** AUDIO START*/
export let soundVolume: Writable<number> = writable(0.75);

/** AUDIO END*/

/** LOGIN START*/
export let isLoginPanelOpen: Writable<boolean> = writable(false);
export let loginActiveTab: Writable<number> = writable(0);
export let isLoggedIn: Writable<boolean> = writable(false);

export let accessTokenExpiresAt: Writable<number> = writable(0);

/** LOGIN END*/

export let refreshRightPanel: Writable<boolean> = writable(false);

/** User Details START */
export let userDetails: Writable<User | null> = writable(null);
/** User Details END */
