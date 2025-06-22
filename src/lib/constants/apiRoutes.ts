import type { Difficulty, Industry } from '../../routes/games/guess-the-movie/movie';

const BASE_URL = 'https://quickgamez.com';

export const API_ROUTES = {
	USER: {
		CREATE_USER: BASE_URL + '/api/v1/users',
		REGISTER: BASE_URL + '/api/v1/users/auth/register',
		GET_MY_PROFILE: BASE_URL + '/api/v1/users/my-profile',
		AUTH: {
			LOGIN: BASE_URL + '/api/v1/users/auth/login',
			GOOGLE_LOGIN: BASE_URL + '/api/v1/users/auth/google',
			REFRESH_ACCESS_TOKEN: BASE_URL + '/api/v1/users/auth/access-token',
			VERIFY_EMAIL: BASE_URL + `/api/v1/users/auth/verify-email`,
			SEND_EMAIL_OTP: BASE_URL + `/api/v1/users/auth/send-email-otp`,
			FORGOT_PASSWORD: BASE_URL + `/api/v1/users/auth/forgot-password`,
			RESET_PASSWORD: BASE_URL + `/api/v1/users/auth/reset-password`,
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
		GET_RANDOM_MOVIES: (industry: Industry, difficulty: Difficulty, count: number = 5) =>
			BASE_URL +
			`/api/v1/movies/random?industry=${industry}&difficulty=${difficulty.toLowerCase()}&count=${count}`,
		SAVE_RESULT: BASE_URL + `/api/v1/games/guess-the-movie/results`,
		SAVE_MULTIPLE_RESULTS: BASE_URL + `/api/v1/games/guess-the-movie/results/multiple`
	},
	REBUS_PUZZLES: {
		GET_UNPLAYED_PUZZLES: (count: number = 5, difficulty?: Difficulty) =>
			BASE_URL +
			`/api/v1/rebus/unplayed?count=${count}${difficulty ? `&difficulty=${difficulty.toLowerCase()}` : ''}`,
		GET_RANDOM_PUZZLES: (count: number = 5, difficulty?: Difficulty) =>
			BASE_URL +
			`/api/v1/rebus/random?count=${count}${difficulty ? `&difficulty=${difficulty.toLowerCase()}` : ''}`,
		SAVE_RESULT: BASE_URL + `/api/v1/games/rebus-puzzles/results`,
		SAVE_MULTIPLE_RESULTS: BASE_URL + `/api/v1/games/rebus-puzzles/results/multiple`
	}
};
