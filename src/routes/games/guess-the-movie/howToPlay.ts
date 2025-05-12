let howToPlay: string[] = [];
howToPlay.push('Your goal is to guess the name of the movie.');
howToPlay.push("You can guess the movie's name, one letter at a time.");
howToPlay.push(
	"Just press the letter you believe is in the movie's name. If the letter is part of the name, the first occurrence will be revealed."
);
howToPlay.push(
	"If the letter is not in the movie's name, you will lose a life (heart), and the letter will be disabled for future guessing. Additionally, a hint about the movie will be unlocked to help you."
);
howToPlay.push(
	"Win by correctly guessing all the letters of the movie's name before losing all your lives (or before time runs out if the timer is on)!"
);
howToPlay.push(
	"If you use up all your lives (or time runs out if the timer is on) before guessing all the letters of the movie's name, you will lose."
);

export default howToPlay;
