<script lang="ts">
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import { soundVolume } from '../../../routes/stores';
	import { Icon } from 'svelte-icons-pack';
	import { FiCheck } from 'svelte-icons-pack/fi';
	import { IoClose } from 'svelte-icons-pack/io';
	import toggleSound from '$lib/assets/audio/click_for_game_menu.mp3';

	export let isChecked = false;
	export let label: string = '';

	const dispatch: EventDispatcher<any> = createEventDispatcher();

	function toggle(_event: Event) {
		dispatch('toggle', isChecked);
		playAudio();
	}

	let audioClickSelect: HTMLAudioElement;

	function playAudio() {
		if (!audioClickSelect) return;
		audioClickSelect.volume = $soundVolume;
		audioClickSelect.currentTime = 0;
		audioClickSelect.play();
	}
</script>

<audio class="hidden" bind:this={audioClickSelect} preload="auto">
	<source src={toggleSound} type="audio/mpeg" />
</audio>

<div class="flex flex-row justify-center p-1">
	<button
		on:click={toggle}
		class="flex flex-row items-center px-3 py-2 border rounded-md {isChecked
			? 'border-emerald-700 bg-emerald-300'
			: 'border-neutral-500 bg-neutral-200'}"
		aria-label="{label} is {isChecked ? 'on' : 'off'}"
	>
		<span class="flex mr-4">{label}</span>

		<Icon src={isChecked ? FiCheck : IoClose} className="w-5 h-5" />
	</button>
</div>
