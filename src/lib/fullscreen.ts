export function enterFullscreen() {
	const doc = document.documentElement;
	if (doc.requestFullscreen) {
		doc.requestFullscreen();
	} else if ((doc as any).mozRequestFullScreen) {
		/* Firefox */
		(doc as any).mozRequestFullScreen();
	} else if ((doc as any).webkitRequestFullscreen) {
		/* Chrome, Safari */
		(doc as any).webkitRequestFullscreen();
	} else if ((doc as any).msRequestFullscreen) {
		/* IE/Edge */
		(doc as any).msRequestFullscreen();
	}
}

export function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if ((document as any).mozCancelFullScreen) {
		/* Firefox */
		(document as any).mozCancelFullScreen();
	} else if ((document as any).webkitExitFullscreen) {
		/* Chrome, Safari */
		(document as any).webkitExitFullscreen();
	} else if ((document as any).msExitFullscreen) {
		/* IE/Edge */
		(document as any).msExitFullscreen();
	}
}

export function isFullscreen(): boolean {
	return !!(
		document.fullscreenElement ||
		(document as any).webkitFullscreenElement ||
		(document as any).mozFullScreenElement ||
		(document as any).msFullscreenElement
	);
}
