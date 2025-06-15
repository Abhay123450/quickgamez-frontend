export type Rebus = {
	rebusId: string;
	rebusImageUrl: string;
	answer: string;
	explanation: string;
	difficulty: Difficulty;
	createdAt: Date;
	updatedAt: Date;
};

export enum Difficulty {
	Easy = 'easy',
	Medium = 'medium',
	Hard = 'hard'
}

export interface RebusObj {
	character: string;
	isGuessed: boolean;
	isGuessedByUser: boolean;
}

export type GameData = {
	difficulty: 'easy' | 'medium' | 'hard';
	rebusId: string;
	rebusAnswerUnguessed: string;
	isTimerOn: boolean;
	timeGiven: number;
	timeLeft: number;
	livesUsed: number;
	startedAt: number;
	endedAt: number;
	guesses: Array<{ character: string; isCorrect: boolean; guessedAt: Date }>;
	result: 'win' | 'lose';
	pointsBreakdown: string[];
};

export enum GameState {
	None = 'None',
	Start = 'Start',
	Playing = 'Playing',
	Pause = 'Pause',
	ShowScore = 'ShowScore',
	Won = 'Won',
	Lost = 'Lost',
	Tutorial = 'Tutorial'
}
