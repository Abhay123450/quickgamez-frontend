<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	import {
		addGameLog,
		addToast,
		isGameInProgess,
		isGamesNavWindowOpen,
		isMyAccountWindowOpen,
		isNotificationWindowOpen,
		isSettingsWindowOpen,
		isSideNavWindowOpen,
		showGameLog,
		soundVolume
	} from '../../../stores.js';

	import { trapFocus } from '$lib/actions.js';

	import InputSingle from '$lib/components/guess-the-movie/InputSingle.svelte';
	import Keyboard from '$lib/components/guess-the-movie/Keyboard.svelte';
	import HealthBar from '$lib/components/guess-the-movie/HealthBar.svelte';
	import ToggleSwitch from '$lib/components/common/ToggleSwitch.svelte';
	import ToggleFullscreen from '$lib/components/common/ToggleFullscreen.svelte';
	import Timer from '$lib/components/common/Timer.svelte';
	import HowToPlay from '$lib/components/common/HowToPlay.svelte';
	import AboutGame from './AboutGuessTheMovie.svelte';
	import GameComments from '$lib/components/comments/GameComments.svelte';
	import SoundControl from '$lib/components/common/SoundControl.svelte';
	import { RiSystemInformation2Line } from 'svelte-icons-pack/ri';
	import { TrOutlineMenu2 } from 'svelte-icons-pack/tr';
	import TopNav from '$lib/components/common/TopNav.svelte';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest.js';
	import {
		Difficulty,
		GameState,
		type Hint as MovieHint,
		type Industry,
		type Movie,
		type MovieObj,
		type GameData
	} from '../movie.js';
	import Hint from '$lib/components/common/Hint.svelte';
	import { calculateScore } from '../calculateScore.js';
	import Leaderboards from '$lib/components/common/Leaderboards.svelte';
	import type { Tab as TabType } from '$lib/components/tabs/Tabs.js';
	import Tab from '$lib/components/tabs/Tab.svelte';
	import Dropdown from '$lib/components/common/Dropdown.svelte';
	import { pushState } from '$app/navigation';
	import ScoreCounter from '$lib/components/common/ScoreCounter.svelte';
	import howToPlay from '../howToPlay.js';
	// utils
	import { getRandomNumBetween } from '$lib/utils/getRandomNumBetween.js';
	import { focus } from '$lib/utils/focus.js';
	import { isAlphaNumeric } from '$lib/utils/isAlphaNumeric.js';
	import { base64Encode, decodeJSON, encodeJSON } from '$lib/utils/encodeDecode.js';
	// Icons
	import { Icon } from 'svelte-icons-pack';
	import { IoClose, IoTrophyOutline } from 'svelte-icons-pack/io';
	import { BiCommentDetail } from 'svelte-icons-pack/bi';
	import { FiPlayCircle } from 'svelte-icons-pack/fi';
	import { CgClose } from 'svelte-icons-pack/cg';
	import { AiOutlineInfoCircle } from 'svelte-icons-pack/ai';
	import { BsQuestionSquare } from 'svelte-icons-pack/bs';
	import { API_ROUTES } from '$lib/constants/apiRoutes.js';
	import { pageSchemaHollywood } from './pageSchema.js';
	import LdTag from '$lib/jsonld/LDTag.svelte';
	// assets
	import correctChoiceSound from '$lib/assets/audio/correct-choice.mp3';
	import successSound from '$lib/assets/audio/success.mp3';
	import errorSound from '$lib/assets/audio/error.mp3';
	import loseSound from '$lib/assets/audio/lose.mp3';
	import youLoseImage from '$lib/assets/images/you-lose.webp';
	import youWinImage from '$lib/assets/images/you-win.webp';

	const host = `http://${$page.url.hostname}:4000`;

	let tabs: TabType[] = [
		{ name: 'PLAY', icon: FiPlayCircle },
		{ name: 'Leaderboard', icon: IoTrophyOutline },
		{ name: 'Comments', icon: BiCommentDetail },
		{ name: 'About', icon: AiOutlineInfoCircle }
	];
	let currentTab: string = tabs[0].name;

	let parentDiv: HTMLDivElement;
	let startDiv: HTMLDivElement;
	let newHintDiv: HTMLDivElement; // scroll to this new hint (when unlocked)

	let keysPressed = new Set<string>();

	function scrollToTarget(targetElement: HTMLElement) {
		if (!targetElement) return;
		targetElement.scrollIntoView({ behavior: 'smooth' });
	}

	$: scrollToTarget(newHintDiv);

	let movieName: string = 'Guess The Movie – Hollywood';

	let isStarting: boolean = false;
	let showHints = false;

	let movieObjArray: MovieObj[];

	const maxChances: number = 5;
	let chancesLeft: number = 0;

	let hints: MovieHint[] = [];

	let disabledKeys: string[] = [];
	let isQwertyKeyboard: boolean = true;
	let isTimerOn: boolean = true;
	let maxTime: number = 120; // in seconds
	let timeLeft: number = 120;
	let movieInfo: string = '_';
	const difficultyOptions: Difficulty[] = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];
	let difficulty: Difficulty = Difficulty.Easy;

	$: timeLeft = maxTime;

	let currentGameState: GameState = GameState.Start;
	let previousGameState: GameState = GameState.Start;

	const options: Industry[] = ['Bollywood', 'Hollywood'];
	let industry: Industry = options[1];

	//audio
	let loseHealthAudio: HTMLAudioElement;
	let correctGuessAudio: HTMLAudioElement;
	let gameWinAudio: HTMLAudioElement;
	let gameLoseAudio: HTMLAudioElement;

	// gameplay data
	let gameData: Partial<GameData> = { guesses: [] };
	let gameScore: number = 0;

	function toggleQwertyKeyboard() {
		isQwertyKeyboard = !isQwertyKeyboard;
	}

	function toggleTimer() {
		isTimerOn = !isTimerOn;
	}

	function movieStringToObject(movie: string): MovieObj[] {
		if (movieName === 'Guess The Movie – Hollywood') {
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
		let result: number[] = [];
		let gap = 6;
		let nextPos;
		let random = getRandomNumBetween(0, 4);
		console.log(`movieObjArr ${JSON.stringify(movieObjArr)}`);
		// starting from 1st index to never guess first letter (0th index)
		for (let i = 1; i < movieObjArr.length; i += gap) {
			let letterGuessed = false;
			for (let j = i; j < i + gap && j < movieObjArr.length; j++) {
				if (!isAlphaNumeric(movieObjArr[j].character) && movieObjArr[j].character !== ' ') {
					result.push(j);
					letterGuessed = true;
				}
			}
			if (letterGuessed) {
				continue;
			}

			random = getRandomNumBetween(0, gap - 1);

			nextPos = i + random;
			if (nextPos >= movieObjArr.length) {
				break;
			}
			result.push(nextPos);
		}
		return result;
	}

	function handleKeyDown(event: any) {
		let char = event.key.toString();
		keysPressed.add(char);
		if (keysPressed.size > 1 && !keysPressed.has('Shift')) {
			return;
		}
		char = char.toUpperCase();

		switch (currentGameState) {
			case GameState.Start:
				break;
			case GameState.Pause:
				if (char === 'ESCAPE') {
					currentGameState = GameState.Playing;
					focus(parentDiv);
				}
				break;
			case GameState.Playing:
				if (char === 'ESCAPE') {
					currentGameState = GameState.Pause;
					break;
				}
				if (char.length === 1 && isAlphaNumeric(char)) {
					guess(char);
				}
				break;
			case GameState.Won:
				if (char === 'ENTER') {
					currentGameState = GameState.ShowScore;
				}
				break;
			case GameState.Lost:
				if (char === 'ENTER') {
					currentGameState = GameState.ShowScore;
				}
				break;
			case GameState.ShowScore:
				if (char === 'ENTER') {
					changeGameState(GameState.Start);
				}
				break;
			default:
				break;
		}
	}

	function handleKeyUp(event: any) {
		let char = event.key.toString();
		keysPressed.delete(char);
	}

	function getInput(event: any) {
		let char = event.detail.char.toString();
		if (char === 'ESCAPE') {
			if (currentGameState === GameState.Playing) {
				currentGameState = GameState.Pause;
			} else if (currentGameState === GameState.Pause) {
				currentGameState = GameState.Playing;
				focus(parentDiv);
			}
		} else if (
			char.length === 1 &&
			isAlphaNumeric(char) &&
			currentGameState === GameState.Playing
		) {
			guess(char);
		}
	}

	function guess(char: string) {
		if (disabledKeys.includes(char)) {
			return;
		}
		const guessedAt = Date.now();
		let correct = checkGuess(char, movieObjArray);
		if (correct) {
			correctGuessAudio.volume = $soundVolume;
			correctGuessAudio.currentTime = 0;
			correctGuessAudio.play();

			movieObjArray = [...movieObjArray];
			const guessComplete = isAllGuessed(movieObjArray);
			addToast(`Your guess: ${char} is correct`, 'success');
			addGameLog({
				timestamp: new Date(guessedAt),
				message: `Your guess: ${char} is correct`,
				type: 'success'
			});
			gameData.guesses?.push({
				guessedAt: new Date(guessedAt),
				character: char,
				isCorrect: true
			});
			if (guessComplete) {
				addGameLog({
					timestamp: new Date(guessedAt),
					message: `You won!`,
					type: 'success'
				});
				gameWon();
			}
			parentDiv.focus();
		} else {
			loseHealthAudio.volume = $soundVolume;
			loseHealthAudio.currentTime = 0.08;
			loseHealthAudio.play();
			//disable key
			disabledKeys = [...disabledKeys, char];
			//reduce chances (health)
			chancesLeft--;
			addToast(`Your guess: ${char} is incorrect`, 'error');
			addToast(`New hint unlocked`, 'info');
			addGameLog({
				timestamp: new Date(guessedAt),
				message: `Your guess: ${char} is incorrect`,
				type: 'error'
			});
			addGameLog({
				timestamp: new Date(guessedAt),
				message: `New hint unlocked`,
				type: 'info'
			});
			gameData.guesses?.push({
				guessedAt: new Date(guessedAt),
				character: char,
				isCorrect: false
			});
			if (chancesLeft === 0) {
				addGameLog({
					timestamp: new Date(guessedAt),
					message: `You lost!`,
					type: 'error'
				});
				gameLost();
			}
			unlockHint();
			parentDiv.focus();
		}
	}

	function checkGuess(char: string, movieObjArray: MovieObj[]): boolean {
		for (let i = 0; i < movieObjArray.length; i++) {
			if (movieObjArray[i].character === char && !movieObjArray[i].isGuessed) {
				movieObjArray[i].isGuessed = true;
				movieObjArray[i].isGuessedByUser = true;
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

	function handleTimesUp() {
		addGameLog({
			timestamp: new Date(),
			message: `Time's up!`,
			type: 'error'
		});
		addGameLog({
			timestamp: new Date(),
			message: `You lost!`,
			type: 'error'
		});
		gameLost();
	}

	function gameWon() {
		gameData.endedAt = Date.now();
		gameData.result = 'win';
		gameData.livesUsed = maxChances - chancesLeft;
		gameData.timeLeft = timeLeft;
		console.log('gameData won', gameData);
		saveResultOnServer(gameData as GameData);
		addGameLog({
			timestamp: new Date(),
			message: `The movie was: ${movieName}`,
			type: 'info'
		});
		gameScore = calculateScore(gameData as GameData);
		gameWinAudio.volume = $soundVolume;
		gameWinAudio.currentTime = 0;
		gameWinAudio.play();
		currentGameState = GameState.Won;
		$isGameInProgess = false;
	}

	function gameLost() {
		gameData.endedAt = Date.now();
		gameData.result = 'lose';
		gameData.livesUsed = maxChances - chancesLeft;
		gameData.timeLeft = timeLeft;
		console.log('gameData lost', gameData);
		saveResultOnServer(gameData as GameData);
		addGameLog({
			timestamp: new Date(),
			message: `The movie was: ${movieName}`,
			type: 'info'
		});
		gameScore = calculateScore(gameData as GameData);
		gameLoseAudio.volume = $soundVolume;
		gameLoseAudio.currentTime = 0;
		gameLoseAudio.play();
		currentGameState = GameState.Lost;
		$isGameInProgess = false;
	}

	function quitGame() {
		gameLost();
	}

	async function saveResultOnServer(result: GameData) {
		try {
			const request: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(result)
			};
			const [error, response] = await fetchWithTokenRefresh(
				new URL(API_ROUTES.GUESS_THE_MOVIE.SAVE_RESULT),
				request
			);
			if (error) {
				console.log('error saving on server', error);
				saveResultNotSavedOnServerInLocalStorage(result);
				return;
			}
			console.log('result saved on server', response);
		} catch (error) {
			console.log(error);
			saveResultNotSavedOnServerInLocalStorage(result);
		}
	}

	function saveResultNotSavedOnServerInLocalStorage(result: GameData) {
		try {
			const key = 'games-not-saved-on-server';
			let games: GameData[] = JSON.parse(localStorage.getItem(key) || '[]');
			games.push(result);
			localStorage.setItem(key, JSON.stringify(games));
		} catch (error) {
			console.error('oops');
		}
	}

	function changeGameState(gameState: GameState) {
		previousGameState = currentGameState;
		currentGameState = gameState;

		if (gameState === GameState.Playing) {
			focus(parentDiv);
		}
	}

	function hideModal() {
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
		return `${difficulty.slice(0, 1).toUpperCase() + difficulty.slice(1).toLowerCase()} - ${numberOfWords} ${numberOfWords > 1 ? 'words' : 'word'} (${letterInfo})`;
	}

	function getTimerDuration(movieName: string): number {
		let defaultTime = 120;
		//remove spaces and count letters
		const nameLength = movieName.replace(/\s/g, '').length;
		// 10 seconds extra for each letter
		return defaultTime + nameLength * 10;
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

		let movie = await getMovieFromApi();

		if (!movie) {
			isStarting = false;
			return addToast('Failed to load movie', 'error', 8000);
		}

		showHints = true;
		movieName = movie.name;
		movieInfo = movieNameInfo(movieName);
		movieObjArray = movieStringToObject(movieName);
		movieObjArray = guessRandomWords(movieObjArray);
		// reset lives
		chancesLeft = maxChances;
		// reset timer
		maxTime = getTimerDuration(movieName);
		// reset hints
		hints = [];
		hints = [
			...hints,
			{ hint: movie.hints[0], isLocked: false },
			{ hint: movie.hints[3], isLocked: true },
			{ hint: `It was released in ${new Date(movie.releaseDate).getFullYear()}.`, isLocked: true },
			{ hint: `Genre: ${movie.genre.join(', ')}`, isLocked: true },
			{ hint: `It stars ${movie.actors.join(', ')}.`, isLocked: true }
		];
		// if (difficulty === Difficulty.Easy) {
		// 	hints[0].isLocked = false;
		// 	hints = [...hints, { hint: movie.hints[4], isLocked: true }];
		// }
		// hide modal
		hideModal();
		focus(parentDiv);
		// change gamestate
		currentGameState = GameState.Playing;
		addGameLog({
			timestamp: new Date(),
			message: `New game started`,
			type: 'neutral'
		});
		addGameLog({
			timestamp: new Date(),
			message: `${movieInfo}`,
			type: 'neutral'
		});
		addGameLog({
			timestamp: new Date(),
			message: `Movie to guess:\n ${movieObjArray
				.map((obj) => {
					return obj.isGuessed ? obj.character : '_';
				})
				.join(' ')}`,
			type: 'neutral'
		});
		if (isTimerOn) {
			addGameLog({
				timestamp: new Date(),
				message: `You have ${maxTime} seconds`,
				type: 'neutral'
			});
		}
		gameData = {
			movieId: movie.id,
			movieNameUnguessed: movieObjArray
				.map((obj) => (obj.isGuessed ? obj.character : '*'))
				.join(''),
			difficulty: difficulty,
			industry: industry,
			startedAt: Date.now(),
			isTimerOn: isTimerOn,
			timeGiven: maxTime,
			guesses: []
		};
		console.log('gameData', gameData);
		closeMiniWindows();
		$showGameLog = true;
		$isGameInProgess = true;
		isStarting = false;
	}

	function closeMiniWindows() {
		// Left Panel
		$isSideNavWindowOpen = false;
		$isSettingsWindowOpen = false;
		$isGamesNavWindowOpen = false;
		// Right Panel
		$isMyAccountWindowOpen = false;
		$isNotificationWindowOpen = false;
	}

	function changeDifficulty(value: string) {
		difficulty = value as Difficulty;
		console.log('selectedDefficulty', difficulty);
	}

	function viewHowToPlay() {
		// showTutorial = true;
		pushState('', { ...$page.state, showTutorial: true });
	}

	function closeHowtoPlay(e?: Event) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		history.back();
		document.getElementById('how-to-play-button')?.focus();
	}

	async function getMovieFromApi(): Promise<Movie | null> {
		let movie = getMovieFromCache(industry, difficulty);
		if (movie) {
			return movie;
		}
		const url = new URL(API_ROUTES.GUESS_THE_MOVIE.GET_UNPLAYED_MOVIES(industry, difficulty, 5));
		const request: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const [error, response] = await fetchWithTokenRefresh<Movie[]>(url, request);
		// Check if the response is successful (status code in the range 200-299)
		if (error) {
			addToast(error.error, 'error', 12000);
			return null;
		}

		const movies: Movie[] = response;
		if (movies.length < 1) {
			addToast('No movies found', 'error', 5000);
			return null;
		}
		movie = movies[0];
		saveMovieToCache(movies.slice(1));
		return movie;
	}

	function saveMovieToCache(movies: Movie[]) {
		try {
			const key = `movies-${industry.toUpperCase()}-${difficulty.toLowerCase()}`;
			sessionStorage.setItem(base64Encode(key), encodeJSON(movies.slice(1)));
		} catch (error) {
			// error
		}
	}

	function getMovieFromCache(industry: Industry, difficulty: Difficulty): Movie | null {
		try {
			let key = `movies-${industry.toUpperCase()}-${difficulty.toLowerCase()}`;
			key = base64Encode(key);
			let encodedCachedMovies = sessionStorage.getItem(key);
			console.log('cachedMovies', encodedCachedMovies);
			if (!encodedCachedMovies) {
				return null;
			}

			const movies: Movie[] = decodeJSON(encodedCachedMovies) as Movie[];
			console.info('movies from cache', movies);

			if (movies.length === 0) {
				return null;
			}
			const movie = movies.pop() || null;
			if (!movie) {
				console.log('cached movie not found');
				return null;
			}
			// sessionStorage.setItem(key, encodeJSON(movies));
			saveMovieToCache(movies);
			console.log('movie from cache', movie);
			return movie;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	$: if (chancesLeft === 1) {
		addToast('You have 1 chance left', 'warning', 5000);
	}

	onMount(() => {
		// $isLeftPanelOpen = false;
		// $isRightPanelOpen = false;
	});

	onDestroy(() => {
		$isGameInProgess = false;
	});

	movieObjArray = movieStringToObject(movieName);
</script>

<svelte:head>
	<title>Guess The Movie – Hollywood | Play online for free | QuickGamez</title>
	<meta
		name="description"
		content="Play Guess the Movie – Hollywood and guess the name of Hollywood movies before running out of lives or time, with hints to help. With over 1000 movies to guess, this movie guessing game is a fun way to test your movie knowledge."
	/>
	<LdTag schema={pageSchemaHollywood} />
	<link rel="canonical" href="https://quickgamez.com/games/guess-the-movie/hollywood" />
</svelte:head>

<!-- <audio preload="auto" bind:this={correctGuessAudio} class="hidden" src="/audio/correct-choice.mp3"
></audio>
<audio preload="auto" bind:this={loseHealthAudio} class="hidden" src="/audio/error.mp3"></audio>
<audio preload="auto" bind:this={gameWinAudio} class="hidden" src="/audio/success.mp3"></audio>
<audio preload="auto" bind:this={gameLoseAudio} class="hidden" src="/audio/lose.mp3"></audio> -->

<audio preload="auto" bind:this={correctGuessAudio} class="hidden" src={correctChoiceSound}></audio>
<audio preload="auto" bind:this={loseHealthAudio} class="hidden" src={errorSound}></audio>
<audio preload="auto" bind:this={gameWinAudio} class="hidden" src={successSound}></audio>
<audio preload="auto" bind:this={gameLoseAudio} class="hidden" src={loseSound}></audio>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->

<div
	bind:this={parentDiv}
	class="flex flex-col h-full w-full min-h-full bg-teal-200 focus:outline-none relative no-scrollbar"
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:focus={() => (keysPressed = new Set())}
	tabindex="0"
>
	<nav class="flex flex-row w-full bg-teal-200">
		<!-- left -->
		<div class="flex flex-row">
			<button
				on:click={() => pushState('', { ...$page.state, showTutorial: true })}
				class="w-9 h-9 m-1 p-1 rounded bg-white text-white uppercase place-self-end flex"
				tabindex={currentGameState === GameState.Playing ? 0 : -1}
				aria-disabled={currentGameState === GameState.Playing ? false : true}
				aria-label="How to play"
			>
				<i class="flex w-full h-full text-black">
					<Icon className="w-7 h-7" src={BsQuestionSquare} />
				</i>
			</button>
		</div>

		<!-- center -->
		<div class="flex grow items-center justify-around">
			<h1 class="text-base sm:text-lg md:text-xl font-semibold">Guess The Movie – Hollywood</h1>
		</div>

		<!-- right -->
		<div class="flex flex-row">
			<button
				on:click={() => changeGameState(GameState.Pause)}
				class="w-9 h-9 m-1 p-1 rounded bg-white text-white uppercase place-self-end flex"
				tabindex={currentGameState === GameState.Playing ? 0 : -1}
				aria-disabled={currentGameState === GameState.Playing ? false : true}
				aria-label="Menu"
			>
				<i class="flex w-full h-full text-black">
					<Icon className="w-7 h-7" src={TrOutlineMenu2} />
				</i>
			</button>
		</div>
	</nav>
	<div class="flex flex-col flex-grow overflow-y-auto">
		<div
			class="flex flex-row font-mono w-fit max-w-full self-center text-nowrap overflow-x-auto no-scrollbar p-0.5"
		>
			{movieInfo}
		</div>
		<div class="flex flex-row flex-wrap bg-yellow-300">
			{#each movieObjArray as movieObj}
				<InputSingle {...movieObj} />
			{/each}
		</div>
		<div class="flex p-2 justify-between">
			<HealthBar maxHearts={maxChances} heartsLeft={chancesLeft} />
			{#if isTimerOn && (currentGameState === GameState.Playing || currentGameState === GameState.Pause)}
				<Timer
					{maxTime}
					{timeLeft}
					on:timesUp={handleTimesUp}
					on:tick={(e) => (timeLeft = e.detail)}
				/>
			{/if}
		</div>
		<p class="w-auto text-center text-xl uppercase font-medium">Hints</p>
		<div class="flex flex-col overflow-auto" class:hidden={!showHints}>
			{#each hints as hint, i (i)}
				<Hint hint={hint.hint} isLocked={hint.isLocked} bind:newHintDiv />
			{/each}
		</div>
	</div>
	<div class="flex" inert={currentGameState === GameState.Playing ? false : true}>
		<Keyboard
			isNumRow={true}
			isQwerty={isQwertyKeyboard}
			{disabledKeys}
			on:input={getInput}
			on:keydown={handleKeyDown}
		/>
	</div>

	{#if currentGameState !== GameState.Playing}
		<div class="flex flex-col bg-transparent absolute top-0 left-0 w-full h-full z-20">
			<div
				in:fade={{ duration: 300 }}
				out:fly={{ duration: 300 }}
				class="bg-black bg-opacity-50 xl:hidden h-auto"
			>
				<TopNav isShowImage={false} title="Guess The Movie – Hollywood" isH1Tag={false} />
			</div>

			<Tab {tabs} bind:activeTab={currentTab} context="gametab" shallowRouteMode="home-tab-only">
				<div slot="tab1" class="relative w-full h-full flex flex-col justify-center p-1 pt-0">
					{#if currentGameState === GameState.Start}
						<div bind:this={startDiv} class="flex flex-col h-full items-center justify-center">
							<div
								class="bg-white px-2 py-4 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg overflow-auto space-y-2 rounded-scrollbar"
							>
								<p class="text-2xl font-bold hidden xl:flex">Guess The Movie – Hollywood</p>

								<div class="flex w-full md:w-10/12 lg:w-8/12">
									<Dropdown
										options={difficultyOptions.map((option) => ({ label: option, value: option }))}
										defaultOption={difficulty}
										name="Difficulty"
										handleOptionChange={changeDifficulty}
									/>
								</div>

								{#if !isTimerOn}
									<div
										class="flex flex-row w-fit justify-center border border-yellow-500 text-yellow-700 bg-yellow-100 rounded-md p-1 space-x-1"
									>
										<Icon src={RiSystemInformation2Line} className="w-5 h-5 self-center shrink-0" />
										<p class="text-black text-sm">
											Games played without the Timer will not be counted in the Leaderboard.
										</p>
									</div>
								{/if}
								<button
									on:click={startGame}
									class="px-10 py-2 rounded w-auto h-auto bg-red-600 font-medium text-white"
									>{isStarting ? 'Starting...' : 'START'}</button
								>
								<button
									on:click={viewHowToPlay}
									id="how-to-play-button"
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-yellow-300 text-black uppercase"
									>How To Play?</button
								>

								<p class="text-lg font-medium mt-3">Options</p>
								<SoundControl />
								<div class="flex flex-row flex-wrap">
									<ToggleSwitch label="Timer" isChecked={isTimerOn} on:toggle={toggleTimer} />
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
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer"
							on:click={() => {
								changeGameState(GameState.Playing);
							}}
						>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								class="bg-white p-6 w-11/12 h-11/12 relative flex flex-col items-center rounded shadow-lg cursor-auto"
								on:click={(e) => {
									e.stopPropagation();
								}}
							>
								<button
									class="absolute top-2 end-2 h-6 w-6 bg-white text-black"
									on:click={() => changeGameState(GameState.Playing)}
								>
									<Icon src={CgClose} size="24" />
								</button>

								<p class="text-2xl font-bold">Guess The Movie – Hollywood</p>

								<button
									on:click={hideModal}
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-600 font-medium text-white"
									>Continue</button
								>
								<button
									on:click={viewHowToPlay}
									id="how-to-play-button"
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-yellow-300 text-black"
									>How To Play?</button
								>
								<button
									on:click={quitGame}
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-white text-black border border-neutral-200"
									>Quit & Lose</button
								>

								<p class="text-lg font-medium mt-3">Options</p>
								<SoundControl />
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
						<div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
							<div
								class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg"
							>
								<img class="w-8/12 my-3" src={youWinImage} alt="you win" />

								<p
									class="self-center text-lg font-medium text-neutral-600 underline underline-offset-2"
								>
									Answer
								</p>
								<p class="self-center text-lg font-semibold">{movieName}</p>

								<button
									on:click={() => changeGameState(GameState.ShowScore)}
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-600 text-white"
									>Continue
								</button>
							</div>
						</div>
					{:else if currentGameState === GameState.Lost}
						<div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
							<div
								class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg"
							>
								<img class="w-8/12 my-3" src={youLoseImage} alt="you lose" />

								<p
									class="self-center text-lg font-medium text-neutral-600 underline underline-offset-2"
								>
									Answer
								</p>
								<p class="self-center text-lg font-semibold">{movieName}</p>

								<button
									on:click={() => changeGameState(GameState.ShowScore)}
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-600 text-white"
									>Continue
								</button>
							</div>
						</div>
					{:else if currentGameState === GameState.ShowScore}
						<div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
							<div
								class="bg-white p-6 w-11/12 h-11/12 flex flex-col items-center rounded shadow-lg"
							>
								<div class="flex flex-col items-center">
									<h4 class="text-2xl font-bold">Score</h4>
									<ScoreCounter score={gameScore} duration={2000} />
									<h4
										class="text-xl font-medium mt-4 text-neutral-600 underline underline-offset-2"
									>
										Points breakdown
									</h4>
									{#if gameData.pointsBreakdown}
										{#each gameData.pointsBreakdown as pointsBreakdown}
											<p>{pointsBreakdown}</p>
										{/each}
									{/if}
									<h4
										class="text-xl font-medium mt-4 text-neutral-600 underline underline-offset-2"
									>
										Answer
									</h4>
									<p class="text-lg font-semibold">{movieName}</p>
								</div>

								<button
									on:click={() => changeGameState(GameState.Start)}
									class="mt-4 px-10 py-2 rounded w-auto h-auto bg-red-600 text-white"
									>Continue
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Tab 2 -->
				<!-- Leaderboards -->
				<div slot="tab2" class="relative w-full h-full flex flex-col justify-center p-1 pt-0">
					<Leaderboards game="guess-the-movie-hollywood" />
				</div>

				<div slot="tab3" class="relative w-full h-full flex flex-col justify-center p-1 pt-0">
					<GameComments game="guess-the-movie-hollywood" />
				</div>

				<div slot="tab4" class="relative w-full h-full flex flex-col justify-center p-1 pt-0">
					<AboutGame />
				</div>
			</Tab>
		</div>
	{/if}

	{#key $page.state.showTutorial}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			use:trapFocus
			transition:fade={{ duration: 300 }}
			class:hidden={!$page.state.showTutorial}
			class="absolute top-0 left-0 w-full h-full p-2 flex flex-col items-center justify-center bg-black bg-opacity-50 z-30 cursor-pointer"
			on:click={closeHowtoPlay}
			on:keydown={(e) => {
				if (e.key === 'Escape') {
					e.stopPropagation();
					closeHowtoPlay();
				}
			}}
		>
			<button
				transition:fly={{ y: -80, duration: 400 }}
				class="absolute top-4 right-2 bg-white"
				on:click={closeHowtoPlay}
			>
				<Icon src={IoClose} className="w-7 h-7" />
			</button>
			<div
				on:click={(e) => {
					e.stopPropagation();
				}}
				transition:fly={{ duration: 300, y: 50 }}
				class="bg-white p-2 max-h-full flex flex-col items-center rounded shadow-lg overflow-y-auto cursor-auto"
			>
				<h2 class="text-2xl font-bold">Guess The Movie – Hollywood: How To Play?</h2>
				<HowToPlay steps={howToPlay} />
			</div>
		</div>
	{/key}
</div>

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
