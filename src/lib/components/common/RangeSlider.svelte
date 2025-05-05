<script lang="ts">
	import { onMount, createEventDispatcher, afterUpdate, beforeUpdate } from 'svelte';
	const dispatch = createEventDispatcher();

	export let value: number = 50;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let label: string = 'Range Slider';

	let input: HTMLInputElement;

	function updateBackground() {
		if (!input) {
			return;
		}
		const val = ((value - min) / (max - min)) * 100;
		input.style.background = `linear-gradient(to right, #fde047 ${val}%, #d1d5db ${val}%)`;
	}

	onMount(() => {
		input.oninput = () => {
			dispatch('change', { value: input.value });
		};
		input.onchange = () => {
			dispatch('change', { value: input.value });
		};
		updateBackground();
	});

	afterUpdate(() => {
		updateBackground();
	});
</script>

<div class="flex flex-row justify-between w-full max-w-60 bg-white">
	<input
		bind:this={input}
		class="slider"
		bind:value
		type="range"
		{min}
		{max}
		{step}
		aria-label={label}
	/>
	<p class="text-black font-medium w-10 self-center pl-2">{Math.floor(value)}</p>
</div>

<style>
	.slider {
		@apply appearance-none h-3 bg-slate-300 w-full self-center shadow-sm rounded-md border-2 border-black cursor-pointer;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 24px;
		width: 24px;
		background: #fde047;
		border-radius: 10px;
		border: 2px solid #000000;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		height: 24px;
		width: 24px;
		background: #fde047;
		border-radius: 10px;
		border: 2px solid #000000;
		cursor: pointer;
	}

	.slider::-ms-thumb {
		height: 24px;
		width: 24px;
		background: #fde047;
		border-radius: 10px;
		border: 2px solid #000000;
		cursor: pointer;
	}

	.slider::-ms-fill-lower {
		background: #fde047;
	}

	.slider::-ms-fill-upper {
		background: #d1d5db;
	}
</style>
