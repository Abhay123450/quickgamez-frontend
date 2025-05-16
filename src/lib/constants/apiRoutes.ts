import type { Difficulty, Industry } from '../../routes/games/guess-the-movie/movie';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://192.168.1.6:4000';

export const API_ROUTES = {
	USER: {
		CREATE_USER: '/api/v1/users',
		REGISTER: BASE_URL + '/api/v1/users/auth/register',
		GET_MY_PROFILE: BASE_URL + '/api/v1/users/my-profile',
		AUTH: {
			LOGIN: BASE_URL + '/api/v1/users/auth/login',
			REFRESH_ACCESS_TOKEN: BASE_URL + '/api/v1/users/auth/access-token',
			VERIFY_EMAIL: `/api/v1/users/auth/verify-email`,
			SEND_EMAIL_OTP: `/api/v1/users/auth/send-email-otp`,
			FORGOT_PASSWORD: `/api/v1/users/auth/forgot-password`,
			RESET_PASSWORD: `/api/v1/users/auth/reset-password`,
			LOGOUT: BASE_URL + '/api/v1/users/auth/logout'
		},
		CHECK_USERNAME_AVAILABILITY: (username: string) =>
			BASE_URL + `/api/v1/users/check-username?username=${username}`,
		UPDATE_USER_DATA: (userId: string) => BASE_URL + `/api/v1/users/${userId}`
	},
	NOTIFICATIONS: {
		GET_RECENT: (page: number = 1, limit: number = 20) =>
			BASE_URL + `/api/v1/notifications/recent?page=${page}&limit=${limit}`,
		MARK_AS_READ: (notificationId: string) =>
			BASE_URL + `/api/v1/notifications/${notificationId}/read`
	},
	COMMENTS: {
		GET_COMMENTS: (gameId: string, page: number = 1, limit: number = 20, sortQuery: string) =>
			BASE_URL + `/api/v1/comments?game=${gameId}&page=${page}&limit=${limit}&${sortQuery}`,
		GET_REPLIES: (commentId: string, page: number = 1, limit: number = 20) =>
			BASE_URL + `/api/v1/comments/${commentId}/replies?page=${page}&limit=${limit}`,
		ADD_COMMENT: BASE_URL + '/api/v1/comments',
		ADD_REPLY: BASE_URL + '/api/v1/comments/reply',
		LIKE_COMMENT: (commentId: string) => BASE_URL + `/api/v1/comments/${commentId}/like`,
		UNLIKE_COMMENT: (commentId: string) => BASE_URL + `/api/v1/comments/${commentId}/like`,
		DISLIKE_COMMENT: (commentId: string) => BASE_URL + `/api/v1/comments/${commentId}/dislike`,
		UNDISLIKE_COMMENT: (commentId: string) => BASE_URL + `/api/v1/comments/${commentId}/dislike`,
		REPORT_COMMENT: (commentId: string) => BASE_URL + `/api/v1/comments/${commentId}/report`,
		DELETE_COMMENT: (commentId: string) => BASE_URL + `/api/v1/comments/${commentId}`
	},
	LEADERBOARDS: {
		GET_LEADERBOARD: (game: string, timeRange: string, count: number = 10) =>
			BASE_URL + `/api/v1/games/${game}/leaderboard?time=${timeRange.toLowerCase()}&count=${count}`
	},
	CONTACT_US: BASE_URL + '/api/v1/contact-us',
	GUESS_THE_MOVIE: {
		GET_UNPLAYED_MOVIES: (industry: Industry, difficulty: Difficulty, count: number = 5) =>
			BASE_URL +
			`/api/v1/movies/unplayed?industry=${industry}&difficulty=${difficulty.toLowerCase()}&count=${count}`,
		SAVE_RESULT: BASE_URL + `/api/v1/games/guess-the-movie/results`
	}
};
