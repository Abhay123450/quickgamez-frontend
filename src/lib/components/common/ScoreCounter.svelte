<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { derived } from 'svelte/store';

	export let score: number = 0;
	export let duration: number = 1000; // Duration of count-up animation in ms

	const animatedScore = tweened(0, {
		duration,
		easing: cubicOut
	});

	const displayScore = derived(animatedScore, ($animatedScore) => Math.floor($animatedScore));

	onMount(() => {
		animatedScore.set(score);
	});
</script>

<div class="text-center text-5xl font-bold text-black">
	<span>{$displayScore}</span>
</div>
