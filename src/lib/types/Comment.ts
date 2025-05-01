import type { User } from './User';

export type Comment = {
	commentId: string;
	user: Pick<User, 'userId' | 'username' | 'name' | 'avatar'>;
	createdAt: string;
	text: string;
	likeCount: number;
	dislikeCount: number;
	replyCount: number;
	replyToComment?: {
		commentId: string;
		user: {
			userId: string;
			username: string;
			name: string;
		};
	};
	parentCommentId?: string;
	myReaction?: string | null;
	replies?: Comment[];
};
