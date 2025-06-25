<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ToggleSwitch from './ToggleSwitch.svelte';

	let isFullscreen: boolean;

	function toggleFullscreen(): void {
		if (!isFullscreen) {
			enterFullscreen();
			window.umami.track('enter-fullscreen');
		} else {
			exitFullscreen();
			window.umami.track('exit-fullscreen');
		}
	}

	function enterFullscreen(): void {
		const elem = document.documentElement as HTMLElement;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if ((elem as any).mozRequestFullScreen) {
			// Firefox
			(elem as any).mozRequestFullScreen();
		} else if ((elem as any).webkitRequestFullscreen) {
			// Chrome, Safari, and Opera
			(elem as any).webkitRequestFullscreen();
		} else if ((elem as any).msRequestFullscreen) {
			// IE/Edge
			(elem as any).msRequestFullscreen();
		}
		isFullscreen = true;
	}

	function exitFullscreen(): void {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if ((document as any).mozCancelFullScreen) {
			// Firefox
			(document as any).mozCancelFullScreen();
		} else if ((document as any).webkitExitFullscreen) {
			// Chrome, Safari, and Opera
			(document as any).webkitExitFullscreen();
		} else if ((document as any).msExitFullscreen) {
			// IE/Edge
			(document as any).msExitFullscreen();
		}
		isFullscreen = false;
	}

	function onFullscreenChange(): void {
		isFullscreen = !!(
			document.fullscreenElement ||
			(document as any).webkitFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).msFullscreenElement
		);
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			onFullscreenChange();
			document.addEventListener('fullscreenchange', onFullscreenChange);
			document.addEventListener('webkitfullscreenchange', onFullscreenChange);
			document.addEventListener('mozfullscreenchange', onFullscreenChange);
			document.addEventListener('MSFullscreenChange', onFullscreenChange);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
			document.removeEventListener('mozfullscreenchange', onFullscreenChange);
			document.removeEventListener('MSFullscreenChange', onFullscreenChange);
		}
	});
</script>

<ToggleSwitch label="Full screen" isChecked={isFullscreen} on:toggle={toggleFullscreen} />
