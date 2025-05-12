export type Movie = {
	id: string;
	name: string;
	industry: Industry; // bollywood, hollywood etc...
	difficulty: string;
	releaseDate: Date;
	actors: string[];
	director: string;
	genre: string[];
	productionHouse: string;
	boxOfficeStatus: string; // hit, flop etc...
	hints: string[];
};

export type Industry = 'Bollywood' | 'Hollywood';

export type Hint = {
	hint: string;
	isLocked: boolean;
};

export interface MovieObj {
	character: string;
	isGuessed: boolean;
	isGuessedByUser: boolean;
}
export enum GameState {
	None = 'None',
	Start = 'Start',
	Playing = 'Playing',
	Pause = 'Pause',
	Tutorial = 'Tutorial',
	Won = 'Won',
	Lost = 'Lost',
	ShowScore = 'ShowScore'
}
export enum Difficulty {
	Easy = 'easy', // 5 hints, 5 lives, pre-guessed letters, pre-unlocked hints
	Medium = 'medium', // 4 hints, 5 lives, pre-guessed letters, no pre-unlocked hints
	Hard = 'hard' // 4 hints, 5 lives, no pre-guessed letters, no pre-unlocked hints
}

export type GameData = {
	industry: Industry;
	difficulty: 'easy' | 'medium' | 'hard';
	movieId: string;
	movieNameUnguessed: string;
	isTimerOn: boolean;
	timeGiven: number;
	timeLeft: number;
	livesUsed: number;
	startedAt: number;
	endedAt: number;
	guesses: Array<{ character: string; isCorrect: boolean; guessedAt: number }>;
	result: 'win' | 'lose';
	pointsBreakdown: string[];
};

export type GuessTheMovieGuesses = GameData['guesses'];
