// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			isLeftPanelOpen?: boolean;
			isRightPanelOpen?: boolean;
			isLoginPanelOpen?: boolean;
			showPageNavigationDialog?: boolean;
			requireLogin?: boolean;
			showDeleteCommentDialog?: boolean;
			showCommentReportDialog?: boolean;
			showAvatarSelectionDialog?: boolean;
			loginActiveTab?: number;
			gamePageActiveTab?: number;
			showHowToPlayDialog?: boolean;
			showTutorial?: boolean;
		}
		// interface Platform {}
	}
	namespace globalThis {
		interface Window {
			google?: any;
			umami?: any;
		}
	}
}

export {};
