<script lang="ts">
	import { onMount } from 'svelte';

	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	import { addToast, isLeftPanelOpen } from '../../stores.js';

	import { trapFocus } from '$lib/actions.js';
	import { movies } from '$lib/movie-data.json';

	import InputSingle from '$lib/components/guess-the-movie/InputSingle.svelte';
	import Keyboard from '$lib/components/guess-the-movie/Keyboard.svelte';
	import HealthBar from '$lib/components/guess-the-movie/HealthBar.svelte';
	import SingleSelectDropdown from '$lib/components/common/SingleSelectDropdown.svelte';
	import ToggleSwitch from '$lib/components/common/ToggleSwitch.svelte';
	import ToggleFullscreen from '$lib/components/common/ToggleFullscreen.svelte';
	import Timer from '$lib/components/common/Timer.svelte';
	import HowToPlay from '$lib/components/common/HowToPlay.svelte';

	type Movie = {
		name: string;
		industry: string; // bollywood, hollywood etc...
		releaseDate: Date;
		actors: string[];
		director: string;
		genre: string[];
		productionHouse: string;
		boxOfficeStatus: string; // hit, flop etc...
		hints: string[];
		easyHints?: string[];
	};

	type Hint = {
		hint: string;
		isLocked: boolean;
	};

	interface MovieObj {
		character: string;
		isGuessed: boolean;
		isGuessedByUser: boolean;
	}
	enum GameState {
		Start = 'Start',
		Playing = 'Playing',
		Pause = 'Pause',
		Tutorial = 'Tutorial',
		Won = 'Won',
		Lost = 'Lost'
	}
	enum Difficulty {
		Easy = 'Easy', // 5 hints, 5 lives, pre-guessed letters, pre-unlocked hints
		Medium = 'Medium', // 4 hints, 5 lives, pre-guessed letters, no pre-unlocked hints
		Hard = 'Hard' // 4 hints, 5 lives, no pre-guessed letters, no pre-unlocked hints
	}
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
	// howToPlay.push('Your goal is to guess the name of the movie.');

	const apiUrlOrigin: string = $page.url.origin;
	// alert(apiUrl);

	let parentDiv: HTMLDivElement;
	let startDiv: HTMLDivElement;
	let pauseDiv: HTMLDivElement;
	let wonDiv: HTMLDivElement;
	let lostDiv: HTMLDivElement;
	let newHintDiv: HTMLDivElement; // scroll to this new hint (when unlocked)

	function scrollToTarget(targetElement: HTMLElement) {
		if (!targetElement) return;
		targetElement.scrollIntoView({ behavior: 'smooth' });
	}

	$: scrollToTarget(newHintDiv);

	let gameName: string = 'Guess The Movie : ';
	let movieName: string = 'Guess The Movie';

	let isStarting: boolean = false;

	let movieObjArray: MovieObj[];

	const maxChances: number = 5;
	let chancesLeft: number = 0;

	let hints: Hint[] = [
		{
			hint: 'A young boy named Arthur McArthur, sets out to find the Holy Grail.',
			isLocked: true
		},
		{
			hint: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus sed, nam quae laborum dolores et labore rem maxime officiis at doloremque quos velit dolor ea? Aperiam temporibus obcaecati explicabo reprehenderit!',
			isLocked: true
		},
		{
			hint: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus sed, nam quae laborum dolores et labore rem maxime officiis at doloremque quos velit dolor ea? Aperiam temporibus obcaecati explicabo reprehenderit!',
			isLocked: true
		},
		{
			hint: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus sed, nam quae laborum dolores et labore rem maxime officiis at doloremque quos velit dolor ea? Aperiam temporibus obcaecati explicabo reprehenderit!',
			isLocked: true
		}
	];

	// let addToDisabledKeys: string = '';
	let isPlaying: boolean = false;
	let disabledKeys: string[] = [];
	let isQwertyKeyboard: boolean = false;
	let isTimerActive: boolean = false;
	// let isFullscreen: boolean = true;
	let maxTime: number = 120; // in seconds
	let timeLeft: number = 120;
	let movieInfo: string = '_';
	const difficultyOptions: string[] = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];
	let difficulty: Difficulty = Difficulty.Medium;

	$: timeLeft = maxTime;

	// $: disabledKeys = [...disabledKeys, addToDisabledKeys];

	let currentGameState: GameState = GameState.Start;
	let previousGameState: GameState = GameState.Start;

	const options: string[] = ['Bollywood', 'Hollywood'];
	// const selectedOption = writable<string>('');
	let selectedOption: string = options[1];

	let showTutorial: boolean = false;

	function toggleLeftPanel() {
		isLeftPanelOpen.update((isOpen) => !isOpen);
	}

	function toggleQwertyKeyboard() {
		isQwertyKeyboard = !isQwertyKeyboard;
	}

	function toggleTimer() {
		isTimerActive = !isTimerActive;
	}

	function movieStringToObject(movie: string): MovieObj[] {
		if (movieName === 'Guess The Movie') {
			return movie.split('').map((char: string): MovieObj => {
				return {
					character: char.toLocaleUpperCase(),
					isGuessed: true,
					isGuessedByUser: false
				};
			});
		}
		return movie.split('').map((char: string): MovieObj => {
			return {
				character: char.toLocaleUpperCase(),
				isGuessed: !isAlphaNumeric(char),
				isGuessedByUser: false
			};
		});
		// return obj;
	}

	function guessRandomWords(movieObjArr: MovieObj[]): MovieObj[] {
		// whitespaces and special characters are always guessed
		let positions: number[] = getRandomPositionToGuess(movieObjArr);
		positions.forEach((pos) => {
			movieObjArr[pos].isGuessed = true;
			movieObjArr[pos].isGuessedByUser = false;
		});
		return movieObjArr;
	}

	function getRandomPositionToGuess(movieObjArr: MovieObj[]): number[] {
		if (difficulty === Difficulty.Hard) {
			// no pre-guessed words for hard mode
			return [];
		}
		let result: number[] = [];
		let initial = 0;
		let gap = 4;
		let nextPos;
		let random = getRandomNumBetween(0, 4);
		for (let i = 0; i < movieObjArr.length; i += gap) {
			random = getRandomNumBetween(0, 3);

			nextPos = i + random;
			if (nextPos >= movieObjArr.length) {
				break;
			}
			if (isAlphaNumeric(movieObjArr[nextPos].character)) {
				result.push(nextPos);
			} else {
				for (let j = i; j <= nextPos; j++) {
					if (isAlphaNumeric(movieObjArr[j].character)) {
						result.push(j);
						break;
					}
				}
			}
		}
		return result;
	}

	function getRandomNumBetween(min: number, max: number): number {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function numberOfGuessedWords(movieObjArr: MovieObj[]): number {
		// count number of alphanumenric characters
		let count = 0;
		for (let i = 0; i < movieObjArr.length; i++) {
			if (isAlphaNumeric(movieObjArr[i].character)) {
				count++;
			}
		}
		if (count < 6) {
			return 1;
		} else if (count < 8) {
			return 2;
		}
		return Math.trunc(count * (30 / 100));
	}

	function isAlphaNumeric(char: string): boolean {
		return /[a-zA-Z0-9]/.test(char);
	}

	function onKeyDown(event: any) {
		// console.log(`onKeyDown ${event.key}`);
		let char = event.key.toString().toLocaleUpperCase();
		// checkGuess(char, movieObjArray);
		// isPlaying = true;

		if (char === 'ESCAPE') {
			if (currentGameState === GameState.Playing) {
				currentGameState = GameState.Pause;
				// focus(pauseDiv);
			} else if (currentGameState === GameState.Pause) {
				currentGameState = GameState.Playing;
				focus(parentDiv);
			}
			// console.log(currentGameState);
		} else if (
			char.length === 1 &&
			isAlphaNumeric(char) &&
			currentGameState === GameState.Playing
		) {
			// console.log('key pressed', char);
			guess(char);
		}
		// console.log(`currentGameState ${currentGameState}`);
	}

	function getInput(event: any) {
		let char = event.detail.char.toString();
		guess(char);
	}

	function guess(char: string) {
		let correct = checkGuess(char, movieObjArray);
		if (correct) {
			movieObjArray = [...movieObjArray];
			const guessComplete = isAllGuessed(movieObjArray);
			addToast(`Your guess: ${char} is correct`, 'success');
			if (guessComplete) {
				gameWon();
			}
		} else {
			//disable key
			disabledKeys = [...disabledKeys, char];
			//reduce chances (health)
			chancesLeft--;
			addToast(`Your guess: ${char} is incorrect`, 'error');
			addToast(`New hint unlocked`, 'info');

			if (chancesLeft === 0) {
				gameLost();
			}
			unlockHint();
		}
	}

	function checkGuess(char: string, movieObjArray: MovieObj[]): boolean {
		// let pos = -1;
		for (let i = 0; i < movieObjArray.length; i++) {
			if (movieObjArray[i].character === char && !movieObjArray[i].isGuessed) {
				movieObjArray[i].isGuessed = true;
				movieObjArray[i].isGuessedByUser = true;
				// pos = i;
				return true;
			}
		}
		//wrong guess
		return false;
	}

	function isAllGuessed(movieObjArray: MovieObj[]): boolean {
		for (let i = 0; i < movieObjArray.length; i++) {
			const element = movieObjArray[i];
			if (!element.isGuessed) {
				return false;
			}
		}
		return true;
	}

	function gameWon() {
		currentGameState = GameState.Won;
	}

	function gameLost() {
		currentGameState = GameState.Lost;
	}

	function focus(element: any) {
		if (element) {
			element.focus();
		}
	}

	function changeGameState(gameState: GameState) {
		previousGameState = currentGameState;
		currentGameState = gameState;

		if (gameState === GameState.Playing) {
			focus(parentDiv);
		}
	}

	function toggleModal() {
		changeGameState(GameState.Playing);
	}

	function unlockHint() {
		for (let i = 0; i < hints.length; i++) {
			if (hints[i].isLocked) {
				hints[i].isLocked = false;
				break;
			}
		}
	}

	function movieNameInfo(name: string): string {
		const words: string[] = name.split(' ');
		const numberOfWords: number = words.length;
		let letterInfo: string = '';
		for (let i = 0; i < numberOfWords; i++) {
			const word: string = words[i];
			letterInfo += word.length.toString();
			letterInfo += ',';
		}
		letterInfo = letterInfo.slice(0, -1);
		return `${selectedOption} - ${numberOfWords} ${numberOfWords > 1 ? 'words' : 'word'} (${letterInfo})`;
	}

	function getTimerDuration(movieName: string): number {
		let defaultTime = 120;
		//remove spaces and count letters
		const nameLength = movieName.replace(/\s/g, '').length;
		// 10 seconds extra for each letter
		return nameLength < 6 ? defaultTime : defaultTime + (nameLength - 5) * 10;
	}

	async function startGame() {
		if (isStarting) {
			return;
		}
		isStarting = true;
		setTimeout(() => {
			isStarting = false;
		}, 30 * 1000);
		// reset disabled keys
		disabledKeys = [];
		disabledKeys = disabledKeys;
		// reset lives
		chancesLeft = maxChances;
		// get movie from api
		let movie = await getMovieFromApi();
		// let movie = await getMovieFromDummyApi();
		if (!movie) {
			isStarting = false;
			return addToast('Failed to load movie', 'error', 10000);
		}
		movieName = movie.name;
		movieInfo = movieNameInfo(movieName);
		// alert(JSON.stringify(movie));
		movieObjArray = movieStringToObject(movieName);
		movieObjArray = guessRandomWords(movieObjArray);
		// reset timer
		maxTime = getTimerDuration(movieName);
		// reset hints
		hints = [];
		hints = [
			...hints,
			{ hint: movie.hints[0], isLocked: true },
			{ hint: movie.hints[1], isLocked: true },
			{ hint: movie.hints[2], isLocked: true },
			{ hint: movie.hints[3], isLocked: true }
		];
		if (difficulty === Difficulty.Easy) {
			hints[0].isLocked = false;
			hints = [...hints, { hint: movie.hints[4], isLocked: true }];
		}
		// hide modal
		toggleModal();
		focus(startDiv);
		// change gamestate
		currentGameState = GameState.Playing;
		isStarting = false;
	}

	function handleSelect(event: CustomEvent<string>) {
		// selectedOption.set(event.detail);
		selectedOption = event.detail;
	}

	function changeDifficulty(event: CustomEvent<string>) {
		difficulty = event.detail as Difficulty;
	}

	function viewTutorial() {
		showTutorial = true;
	}

	function hideTutorial() {
		showTutorial = false;
	}

	async function getMovieFromDummyApi(): Promise<Movie | null> {
		// random number between 0 and 5
		const randomNum = getRandomNumBetween(0, 5);
		const movie: unknown = movies[randomNum];
		return movie as Movie;
	}

	async function getMovieFromApi(): Promise<Movie | null> {
		const url =
			`https://quickgamez.el.r.appspot.com/api/v1/movies/random?industry=` + selectedOption;
		const response = await fetch(url);
		// Check if the response is successful (status code in the range 200-299)
		if (!response.ok) {
			// addToast('Failed to fetch movie', 'error', 6000);
			return null;
		}
		// Parse the JSON data in the response
		const data = await response.json();
		// Work with the JSON data
		if (data.success) {
			return data.data as Movie;
		} else {
			return null;
		}
	}

	$: if (chancesLeft === 1) {
		addToast('You have 1 chance left', 'warning', 5000);
	}

	function pauseGame() {}

	function restartGame() {}

	onMount(async () => {
		// focus(parentDiv);
		// const movie = await getMovieFromApi();
		// if (movie) {
		// }
		// show start menu
		// fetch movie
		// start the game
		// pause menu
		// game over
		// await startGame();
	});
	movieObjArray = movieStringToObject(movieName);
	// movieObjArray = guessRandomWords(movieObjArray);
</script>

<svelte:head>
	<title>Guess The Movie | Play online for free | QuickGamez</title>
	<meta
		name="description"
		content="Play the free online game: 'Guess The Movie' on our website! You can choose from three difficulty levels: easy, medium, and hard. To make it even more challenging, you can enable the timer feature to race against time. Don't worry there are also hints to help you along the way. Enjoy hours of fun without any downloads or sign-ups. Start playing now!"
	/>
</svelte:head>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	bind:this={parentDiv}
	class="flex flex-col h-full w-full min-h-full bg-teal-200 focus:outline-none relative no-scrollbar"
	on:keydown={onKeyDown}
	tabindex="0"
>
	<nav class="flex flex-row w-full bg-teal-200">
		<!-- left -->
		<div class="flex flex-row">
			<button
				on:click={toggleLeftPanel}
				class="w-9 h-9 m-1 p-1 rounded bg-white text-white uppercase lg:hidden"
			>
				<i class="flex w-full h-full">
					<img src="/icons/menu_icon.svg" alt="menu" />
				</i>
			</button>
			<!-- <i class="flex w-9 h-9 bg-white">
				<button><img src="/icons/menu_icon.svg" alt="menu" /></button>
			</i>
			<a href="/">
				<i class="flex w-9 h-9 bg-white">
					<img src="/icons/home_icon.svg" alt="menu" />
				</i>
			</a> -->
		</div>

		<!-- center -->
		<div class="flex grow items-center justify-around">
			<p class="text-xl font-semibold">Guess The Movie</p>
		</div>

		<!-- right -->
		<div class="flex flex-row">
			<button
				on:click={() => changeGameState(GameState.Pause)}
				class="w-9 h-9 m-1 p-1 rounded bg-white text-white uppercase place-self-end"
			>
				<i class="flex w-full h-full">
					<img src="/icons/setting_icon.svg" alt="menu" />
				</i>
			</button>
			<!-- <button
				on:click={viewTutorial}
				class="w-9 h-9 m-1 p-1 rounded bg-white text-white uppercase place-self-end"
			>
				<i class="flex w-full h-full">
					<img src="/icons/question_icon.svg" alt="menu" />
				</i>
			</button> -->
		</div>
	</nav>
	<div class="flex flex-col flex-grow overflow-auto">
		<div class="flex font-mono w-full justify-center">{movieInfo}</div>
		<div class="flex flex-row flex-wrap bg-amber-300">
			{#each movieObjArray as movieObj}
				<InputSingle {...movieObj} />
			{/each}
		</div>
		<div class="flex p-2 justify-between">
			<HealthBar maxHearts={maxChances} heartsLeft={chancesLeft} />
			{#if isTimerActive && (currentGameState === GameState.Playing || currentGameState === GameState.Pause)}
				<Timer {maxTime} {timeLeft} on:timesUp={gameLost} />
			{/if}
		</div>
		<p class="w-auto text-center text-xl uppercase font-medium">Hints</p>
		<div class="flex flex-col overflow-auto">
			{#each hints as hint}
				<div
					class="flex justify-around w-auto h-fit mx-2 my-1 border border-neutral-500 rounded-md bg-neutral-100"
				>
					{#if hint.isLocked}
						<div class="flex w-full p-1 items-center justify-center bg-neutral-300 rounded-md">
							<i class="h-6 w-6">
								<img src="/icons/lock_icon.svg" alt="locked" />
							</i>
							<p class="pl-1">This hint is locked. Every wrong guess unlocks a new hint.</p>
						</div>
					{:else}
						<div
							bind:this={newHintDiv}
							class="flex w-full p-1 items-center bg-neutral-50 rounded-md"
							in:fade={{ duration: 1500 }}
						>
							<i class="h-6 w-6 flex-shrink-0">
								<img src="/icons/bulb_icon.svg" alt="hint" />
							</i>
							<p class="pl-1 font-mono">{hint.hint}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="flex">
		<Keyboard isNumRow={true} isQwerty={isQwertyKeyboard} {disabledKeys} on:input={getInput} />
	</div>

	{#if currentGameState === GameState.Start}
		<div
			use:trapFocus
			class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
		>
			<div class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg">
				<a tabindex="-1" href="/" class="self-start h-8 w-8">
					<img tabindex="-1" src="/icons/home_icon.svg" alt="home" />
				</a>

				<h1 class="text-2xl font-bold">Guess The Movie</h1>

				<div class="flex w-full md:w-10/12 lg:w-8/12">
					<SingleSelectDropdown {options} selected={selectedOption} on:select={handleSelect} />
				</div>
				<div class="flex w-full md:w-10/12 lg:w-8/12">
					<SingleSelectDropdown
						options={difficultyOptions}
						selected={difficulty}
						on:select={changeDifficulty}
					/>
				</div>

				<button
					on:click={startGame}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-500 text-white"
					>{isStarting ? 'Starting...' : 'START'}</button
				>
				<button
					on:click={viewTutorial}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-yellow-300 text-black uppercase"
					>How To Play?</button
				>

				<p class="text-lg font-medium mt-3">Options</p>
				<div class="flex flex-row flex-wrap">
					<ToggleSwitch label="Timer" isChecked={isTimerActive} on:toggle={toggleTimer} />
					<ToggleFullscreen />
					<ToggleSwitch
						label="QWERTY keyboard"
						isChecked={isQwertyKeyboard}
						on:toggle={toggleQwertyKeyboard}
					/>
				</div>
			</div>
		</div>
	{:else if currentGameState === GameState.Pause}
		<div
			use:trapFocus
			class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
		>
			<div class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg">
				<button class="self-end h-8 w-8" on:click={() => changeGameState(GameState.Playing)}>
					<img src="/icons/cross_icon.svg" alt="close" />
				</button>

				<h1 class="text-2xl font-bold">Guess The Movie</h1>
				<!-- <p>This is pause menu.</p> -->

				<!-- <SingleSelectDropdown {options} on:select={handleSelect} /> -->

				<button
					on:click={toggleModal}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-500 text-white">Continue</button
				>
				<button
					on:click={viewTutorial}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-yellow-300 text-black"
					>How To Play?</button
				>
				<button
					on:click={() => changeGameState(GameState.Start)}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-white text-black border border-neutral-200"
					>Start New Game</button
				>

				<p class="text-lg font-medium mt-3">Options</p>
				<div class="flex flex-row flex-wrap">
					<ToggleFullscreen />
					<ToggleSwitch
						label="QWERTY keyboard"
						isChecked={isQwertyKeyboard}
						on:toggle={toggleQwertyKeyboard}
					/>
				</div>
				<!-- <button
					on:click={toggleFullScreen}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-500 text-white">Go Fullscreen</button
				> -->
			</div>
		</div>
	{:else if currentGameState === GameState.Won}
		<div
			use:trapFocus
			class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
		>
			<div class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg">
				<img class="w-48 self-center" src="/images/logo.webp" alt="logo" />

				<!-- <h1 class="text-2xl font-bold">Guess The Movie</h1> -->
				<img class="w-8/12 my-3" src="/images/you-win.webp" alt="you win" />

				<p class="self-center">Answer: {movieName}</p>

				<button
					on:click={() => changeGameState(GameState.Start)}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-500 text-white"
					>Continue
				</button>
			</div>
		</div>
	{:else if currentGameState === GameState.Lost}
		<div
			use:trapFocus
			class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
		>
			<div class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg">
				<!-- <h1 class="text-2xl font-bold">Guess The Movie</h1> -->
				<img class="w-8/12 my-3" src="/images/you-lose.webp" alt="you win" />

				<p class="self-center">Answer: {movieName}</p>

				<button
					on:click={() => changeGameState(GameState.Start)}
					class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-500 text-white"
					>Continue
				</button>
			</div>
		</div>
	{/if}
	{#if showTutorial}
		<div
			use:trapFocus
			class="absolute top-0 left-0 w-full h-full p-2 flex flex-col items-center justify-center bg-black bg-opacity-50"
		>
			<button class="self-end h-6 w-6 bg-white" on:click={hideTutorial}>
				<img src="/icons/cross_icon.svg" alt="close" />
			</button>
			<div
				class="bg-white p-2 max-h-full flex flex-col items-center rounded shadow-lg overflow-y-auto"
			>
				<h1 class="text-2xl font-bold">Guess The Movie: How To Play?</h1>
				<HowToPlay steps={howToPlay} />
				<!-- <p>
					If the letter is not in the movie name, you lose a life (heart) and the letter will be
					disabled for further guesses. Also, a hint about the movie is revealed to help you.
				</p>
				<p>If you guess all the letters of the movie name before running out of lives, you win!</p>
				<p>If you run out of lives before guessing all the letters of the movie name, you lose.</p> -->
			</div>
		</div>
	{/if}
</div>
