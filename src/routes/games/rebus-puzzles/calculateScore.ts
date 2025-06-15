import type { GameData } from './Rebus';

export function calculateScore(gameData: GameData): number {
	const {
		rebusAnswerUnguessed,
		difficulty,
		livesUsed,
		timeLeft,
		timeGiven,
		result,
		guesses,
		isTimerOn
	} = gameData;
	gameData.pointsBreakdown = [];
	let score = 0;
	if (result === 'win') {
		if (difficulty === 'easy') {
			score += 100;
			gameData.pointsBreakdown.push('+100 for win in easy difficulty');
		} else if (difficulty === 'medium') {
			score += 200;
			gameData.pointsBreakdown.push('+200 for win in medium difficulty');
		} else if (difficulty === 'hard') {
			score += 300;
			gameData.pointsBreakdown.push('+300 for win in hard difficulty');
		}

		if (isTimerOn) {
			// +1 point for each second remaining
			const timeBonus = Math.ceil((timeLeft / timeGiven) * 100);
			score += timeBonus;
			gameData.pointsBreakdown.push(`+${timeBonus} for ${timeLeft}/${timeGiven} seconds remaining`);
		}

		// for each lives remaining, add 20 points
		// 5 lives given at the start of every game
		score += (5 - livesUsed) * 20;

		gameData.pointsBreakdown.push(`+${(5 - livesUsed) * 20} for ${5 - livesUsed} lives remaining`);
	}

	// combined score for all correct guesses should be 100
	// hence points awarded for each correct guess = (100) / (number of characters to guess)
	// so, if there are 4 characters to guess, 25 points for each correct guess
	// if the points for each correct guess is in decimal form, round it to the nearest integer

	const numberOfCharactersToGuess: number = rebusAnswerUnguessed
		.split('')
		.reduce((acc: number, char: string) => (char === '*' ? acc + 1 : acc), 0);

	const pointsArray = getPointsArray(numberOfCharactersToGuess);

	let i = 0;
	let scoreForCorrectGuesses = 0;

	guesses.forEach((guess) => {
		if (guess.isCorrect) {
			score += pointsArray[i];
			scoreForCorrectGuesses += pointsArray[i];
			i++;
		}
	});

	gameData.pointsBreakdown.push(
		`+${scoreForCorrectGuesses} for ${i}/${numberOfCharactersToGuess} correct guesses`
	);

	return score;
}

export function getPointsArray(numberOfCharactersToGuess: number): number[] {
	const pointsForEachCorrectGuess = 100 / numberOfCharactersToGuess;
	if (Number.isInteger(pointsForEachCorrectGuess)) {
		return [...Array(numberOfCharactersToGuess).fill(pointsForEachCorrectGuess)];
	} else {
		const floor = Math.floor(pointsForEachCorrectGuess);
		const ceil = Math.ceil(pointsForEachCorrectGuess);
		console.log(`floor ${floor}`);
		console.log(`ceil ${ceil}`);
		for (let i = 2; i <= numberOfCharactersToGuess; i++) {
			let total = floor * (i - 1) + ceil * (numberOfCharactersToGuess - i + 1);
			if (total === 100) {
				return [
					...Array(i - 1).fill(floor),
					...Array(numberOfCharactersToGuess - i + 1).fill(ceil)
				];
			}
		}
		return Array(numberOfCharactersToGuess).fill(floor);
	}
}
