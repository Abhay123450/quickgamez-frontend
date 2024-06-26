<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { addToast } from '../../../routes/stores';
	const dispatch = createEventDispatcher();

	export let maxTime: number = 120; // default max time in seconds
	export let timeLeft: number = maxTime;

	let timer: number;
	// let progress: number;
	// onMount(() => {
	// 	startTimer();
	// });

	function startTimer() {
		clearInterval(timer);
		timer = window.setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= 1;
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

	function secondsToMinute(seconds: number): string {
		return seconds > 59
			? `${Math.floor(seconds / 60)}:${seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`}`
			: `0:${seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`}`;
	}

	$: if (timeLeft === maxTime) {
		startTimer();
	} else if (timeLeft === 30) {
		addToast(`30 seconds left`, 'warning', 3000);
	}

	// Cleanup timer on component destroy
	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<div class="flex flex-row p-1 bg-white rounded-md items-center space-x-1">
	<div class="flex w-6 h-6">
		<img src="/icons/stopwatch_icon.svg" alt="stopwatch" />
	</div>
	<div class=" whitespace-nowrap">
		{secondsToMinute(timeLeft)}
	</div>
</div>
