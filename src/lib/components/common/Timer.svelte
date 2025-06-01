<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { addToast, soundVolume } from '../../../routes/stores';
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemTimerLine } from 'svelte-icons-pack/ri';
	const dispatch = createEventDispatcher();

	import timerSound from '$lib/assets/audio/timer-with-chime.mp3';

	export let maxTime: number = 120; // default max time in seconds
	export let timeLeft: number = maxTime;

	let timer: any;
	let timerAudio: HTMLAudioElement;

	function startTimer() {
		clearInterval(timer);
		timer = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= 1;
				onTick(timeLeft);
			} else {
				clearInterval(timer);
				timesUp();
			}
		}, 1000);
	}

	function timesUp() {
		dispatch('timesUp');
		addToast(`Times up`, 'warning', 3000);
	}

	function onTick(timeLeft: number) {
		dispatch('tick', timeLeft);
	}

	function secondsToMinute(seconds: number): string {
		return seconds > 59
			? `${Math.floor(seconds / 60)}:${seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`}`
			: `0:${seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`}`;
	}

	$: if (timeLeft === maxTime) {
		startTimer();
	} else if (timeLeft === 120) {
		timerAudio.volume = $soundVolume;
		timerAudio.currentTime = 0;
		timerAudio.play();
		setTimeout(() => {
			timerAudio.pause();
		}, 2000);
	} else if (timeLeft === 60) {
		addToast(`60 seconds left`, 'warning', 3000);
		timerAudio.volume = $soundVolume;
		timerAudio.currentTime = 0;
		timerAudio.play();
		setTimeout(() => {
			timerAudio.pause();
		}, 2000);
	} else if (timeLeft === 30) {
		addToast(`30 seconds left`, 'warning', 3000);
		timerAudio.volume = $soundVolume;
		timerAudio.currentTime = 0;
		timerAudio.play();
		setTimeout(() => {
			timerAudio.pause();
		}, 2000);
	} else if (timeLeft === 10) {
		addToast(`10 seconds left`, 'warning', 3000);
		timerAudio.volume = $soundVolume;
		timerAudio.currentTime = 0;
		timerAudio.play();
	}

	// Cleanup timer on component destroy
	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<audio src={timerSound} class="hidden" bind:this={timerAudio} preload="auto"></audio>

<div class="flex flex-row p-1 bg-white rounded-md items-center space-x-1">
	<Icon src={RiSystemTimerLine} className="w-6 h-6 self-center" />
	<div class=" whitespace-nowrap">
		{secondsToMinute(timeLeft)}
	</div>
</div>
