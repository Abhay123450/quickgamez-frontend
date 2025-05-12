<article
	aria-labelledby="about-title"
	class="flex flex-col w-auto h-full p-2 rounded-md bg-white space-y-1 overflow-y-auto rounded-scrollbar"
>
	<header>
		<h2 id="about-title" class="text-xl font-bold">About Guess The Movie - Hollywood</h2>
	</header>

	<p>
		<strong>Guess The Movie - Hollywood</strong> is an exciting <em>movie guessing game</em> where players
		must guess the name of a movie one letter at a time before running out of lives and time.
	</p>

	<section aria-labelledby="start-title">
		<h3 id="start-title" class="text-xl font-bold">Starting the Game</h3>
		<ul class="list-disc ps-4 lg:ps-5">
			<li>Choose a difficulty level: Easy, Medium, or Hard.</li>
			<li>
				Enable or disable the game timer using the "Timer" toggle. <strong>Note:</strong> Games played
				without the timer will not count toward the leaderboard.
			</li>
			<li>Switch keyboard layouts with the "QWERTY keyboard" toggle button.</li>
			<li>Enter fullscreen mode using the "Fullscreen" toggle button.</li>
			<li>Click the "Start" button to begin the game.</li>
		</ul>
	</section>

	<section aria-labelledby="gameplay-title">
		<h3 id="gameplay-title" class="text-xl font-bold">Gameplay</h3>
		<ul class="list-disc ps-4 lg:ps-5">
			<li>
				You start the game with 5 lives and a limited amount of time to guess the movie title.
			</li>
			<li>
				Guess one letter at a time. Incorrect guesses cost a life and reveal a hint. The guessed
				letter is disabled for future use.
			</li>
			<li>Correct guesses reveal the first occurrence of the letter in the movie title.</li>
			<li>You can use either your physical keyboard or the on-screen keyboard to play.</li>
			<li>If you guess the full movie title before running out of lives or time, you win!</li>
			<li>If you lose all your lives or run out of time, the game ends in a loss.</li>
		</ul>
	</section>

	<section aria-labelledby="leaderboard-title">
		<h3 id="leaderboard-title" class="text-xl font-bold">Climbing the Leaderboard</h3>
		<p></p>
		<p></p>
		<ul class="list-disc ps-4 lg:ps-5">
			<li>
				Your score determines your position on the daily, weekly, and all-time leaderboards. The
				daily leaderboard resets every day, the weekly one resets every week, and the all-time
				leaderboard showcases the top players overall.
			</li>
			<li>
				Scores are calculated after each game based on your remaining lives, time left, and number
				of hints used. Play more games to improve your score!
			</li>
		</ul>
	</section>

	<section aria-labelledby="points-title">
		<h3 id="points-title" class="text-xl font-bold">Points System</h3>
		<ul class="list-disc ps-4 lg:ps-5">
			<li>+20 points for each remaining life.</li>
			<li>+1 point for every second remaining on the timer.</li>
			<li>+100 points for winning in Easy difficulty.</li>
			<li>+200 points for winning in Medium difficulty.</li>
			<li>+300 points for winning in Hard difficulty.</li>
			<li>
				100 total points are distributed across all correct guesses. So, if there are 4 characters
				to guess, each correct guess earns 25 points.
			</li>
		</ul>
	</section>
</article>

<style>
	@media (min-width: 768px) {
		/* WebKit-based browsers */
		.rounded-scrollbar::-webkit-scrollbar {
			width: 8px;
		}

		.rounded-scrollbar::-webkit-scrollbar-track {
			background: #f1f1f100;
			border-radius: 6px;
		}

		.rounded-scrollbar::-webkit-scrollbar-thumb {
			background: #afafaf;
			border-radius: 6px;
		}
	}
</style>
