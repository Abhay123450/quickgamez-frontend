import type { Comment } from '$lib/types/Comment';

const ONE_MINUTE = 60 * 1000;

export function getAudioVolume() {
	const volume = localStorage.getItem('audioVolume');
	if (volume) {
		return parseInt(volume);
	}
	return 0.75;
}

export function setAudioVolume(volume: number) {
	localStorage.setItem('audioVolume', volume.toString());
}

export function saveCommentsToLocalStorage(game: string, filter: string, comments: Comment[]) {
	const key = `comments-${game}-${filter}`;
	const updateTime = Date.now();
	// const savedComments = localStorage.getItem(key);
	// if (savedComments) {
	// 	const commentsObj = JSON.parse(savedComments);
	// 	if (updateTime - commentsObj.updateTime <= ONE_MINUTE) {
	// 		return;
	// 	}
	// }
	const commentsObj = {
		comments,
		updateTime
	};
	localStorage.setItem(key, JSON.stringify(commentsObj));
}

export function getCommentsFromLocalStorage(game: string, filter: string): Comment[] | null {
	const key = `comments-${game}-${filter}`;
	const savedComments = localStorage.getItem(key);
	if (savedComments) {
		const commentsObj = JSON.parse(savedComments);
		if (Date.now() - commentsObj.updateTime > ONE_MINUTE) {
			clearFromLocalStorage(`comments-${game}`);
			return null;
		}
		return commentsObj.comments as Comment[];
	}
	return null;
}

export function clearFromLocalStorage(key: string) {
	localStorage.removeItem(key);
}

export function saveRepliesToLocalStorage(commentId: string, replies: Comment[]) {
	const key = `replies-${commentId}`;
	const updateTime = Date.now();
	const repliesObj = {
		replies,
		updateTime
	};
	localStorage.setItem(key, JSON.stringify(repliesObj));
}

export function getRepliesFromLocalStorage(commentId: string): Comment[] | null {
	const key = `replies-${commentId}`;
	const savedReplies = localStorage.getItem(key);
	if (savedReplies) {
		const repliesObj = JSON.parse(savedReplies);
		if (Date.now() - repliesObj.updateTime > ONE_MINUTE) {
			// 5 minutes
			clearFromLocalStorage(`replies-${commentId}`);
			return null;
		}
		return repliesObj.replies as Comment[];
	}
	return null;
}
