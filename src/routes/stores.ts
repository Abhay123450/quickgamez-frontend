import { Theme } from '$lib/constants/theme.enum';
import { writable, type Writable } from 'svelte/store';

export let isLeftPanelOpen: Writable<boolean> = writable(false);
export let theme: Writable<Theme> = writable(Theme.Default);

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
	toasts.update((all) => [...all, { id, message, type }]);

	setTimeout(() => {
		removeToast(id);
	}, duration);
}

export function removeToast(id: number) {
	toasts.update((all) => all.filter((toast) => toast.id !== id));
}
