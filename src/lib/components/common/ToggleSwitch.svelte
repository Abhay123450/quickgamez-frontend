<script lang="ts">
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import { soundVolume } from '../../../routes/stores';
	import { Icon } from 'svelte-icons-pack';
	import { FiCheck } from 'svelte-icons-pack/fi';
	import { IoClose } from 'svelte-icons-pack/io';

	export let isChecked = false;
	export let label: string = '';

	const dispatch: EventDispatcher<any> = createEventDispatcher();

	function handleToggle(event: Event) {
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
	<source src="/audio/click_for_game_menu.mp3" type="audio/mpeg" />
</audio>

<div class="flex flex-row justify-center p-1">
	{#if isChecked}
		<!-- CHECK Icon -->

		<button
			on:click={handleToggle}
			class="flex flex-row items-center px-3 py-2 border border-emerald-700 bg-emerald-300 rounded-md"
			aria-label="{label} is on"
		>
			<span class="flex mr-4">{label}</span>

			<Icon src={FiCheck} className="w-5 h-5" />
		</button>
	{:else}
		<!-- Cross Icon -->
		<button
			on:click={handleToggle}
			class="flex flex-row items-center px-3 py-2 border border-neutral-500 bg-neutral-200 rounded-md"
			aria-label="{label} is off"
		>
			<span class="flex mr-4">{label}</span>

			<Icon src={IoClose} className="w-5 h-5" />
		</button>
	{/if}
</div>
