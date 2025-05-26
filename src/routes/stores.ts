import { Theme } from '$lib/constants/theme.enum';
import type { GameLog } from '$lib/types/GameLog';
import type { User } from '$lib/types/User';
import { writable, type Writable } from 'svelte/store';

export let isLeftPanelOpen: Writable<boolean> = writable(false);
export let isRightPanelOpen: Writable<boolean> = writable(false);
export let theme: Writable<Theme> = writable(Theme.Default);

/** Left Panel Windows START*/
export let isSideNavWindowOpen: Writable<boolean> = writable(true);
export let isSettingsWindowOpen: Writable<boolean> = writable(true);
export let isGamesNavWindowOpen: Writable<boolean> = writable(true);
/** Left Panel END*/

/** Right Panel Windows START*/
export let isMyAccountWindowOpen: Writable<boolean> = writable(true);
export let isNotificationWindowOpen: Writable<boolean> = writable(true);
/** Right Panel END*/

/** IS GAME IN PROGRESS */
export let isGameInProgess: Writable<boolean> = writable(false);

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
export let isLoggedIn: Writable<boolean> = writable(true);

export let accessTokenExpiresAt: Writable<number> = writable(0);

/** LOGIN END*/

export let refreshRightPanel: Writable<boolean> = writable(false);

/** User Details START */
export let userDetails: Writable<User | null> = writable(null);
/** User Details END */

/** Cookie Settings */
export let showCookieSettings: Writable<boolean> = writable(false);
/** Cookie Settings */

/** Game Log START */
export let showGameLog: Writable<boolean> = writable(false);
export const gameLog: Writable<GameLog[]> = writable<GameLog[]>([]);

export function addGameLog(log: GameLog) {
	gameLog.update((all) => [...all, log]);
}

export function clearGameLog() {
	gameLog.set([]);
}

/** Game Log END */

/** trapfocus START */

const previousFocusElements: Writable<HTMLElement[]> = writable([]);

export function pushPreviousFocusElement(element: HTMLElement) {
	previousFocusElements.update((all) => [...all, element]);
}

export function popPreviousFocusElement(): HTMLElement | null {
	let popped: HTMLElement | null = null;
	previousFocusElements.update((all) => {
		popped = all.pop() || null;
		return all;
	});
	return popped;
}

/** trapfocus END */
