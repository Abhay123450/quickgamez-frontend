<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { FaSolidVolumeHigh, FaSolidVolumeLow, FaSolidVolumeXmark } from 'svelte-icons-pack/fa';
	import { soundVolume } from '../../../routes/stores';
	import RangeSlider from './RangeSlider.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	// import { setAudioVolume as saveAudioVolume } from '$lib/utils/localStorage';
	const dispatch = createEventDispatcher();

	function handleVolumeChange(e: any) {
		const value = e.detail.value / 100;
		setAudioVolume(value);
		if (value > 0 && value <= 1) {
			saveAudioVolume(value);
			saveAudioMuteState(false);
		} else if (value === 0) {
			saveAudioVolume(value);
			saveAudioMuteState(true);
		} else {
			saveAudioVolume(0.5);
			saveAudioMuteState(false);
		}
	}

	function setAudioVolume(volume: number) {
		soundVolume.update((n) => volume);
	}

	function muteAudio() {
		saveAudioMuteState(true);
		setAudioVolume(0);
		console.log(`soundVolume`, $soundVolume);
	}

	function unmuteAudio() {
		saveAudioMuteState(false);
		setAudioVolume(getAudioVolume());
	}

	function toggleMuteAudio() {
		if ($soundVolume === 0) unmuteAudio();
		else muteAudio();
		console.log(`soundVolume`, $soundVolume);
	}

	function saveAudioMuteState(state: boolean) {
		localStorage.setItem('isAudioMute', state.toString());
	}

	function getAudioMuteState() {
		const isAudioMute = localStorage.getItem('isAudioMute');
		console.log(`isAudioMute`, isAudioMute);
		if (!isAudioMute) {
			return false;
		}
		return isAudioMute === 'false' ? false : true;
	}

	function saveAudioVolume(volume: number) {
		localStorage.setItem('audioVolume', volume.toString());
	}

	function getAudioVolume() {
		const volume = Number(localStorage.getItem('audioVolume'));
		if (volume) {
			return Number(volume);
		}
		return 0.75;
	}

	onMount(() => {
		getAudioMuteState() ? muteAudio() : unmuteAudio();
	});
</script>

<div class="flex flex-row p-2 self-center">
	<button
		class="text-gray-800 hover:text-gray-800 flex flex-row items-center p-1 px-2"
		on:click={toggleMuteAudio}
		aria-label="Toggle mute/unmute audio"
	>
		<Icon className="w-6 h-6" src={$soundVolume === 0 ? FaSolidVolumeXmark : FaSolidVolumeHigh} />
	</button>
	<RangeSlider
		min={0}
		max={100}
		value={$soundVolume * 100}
		step={1}
		on:change={handleVolumeChange}
		label="Sound Volume"
	/>
</div>
