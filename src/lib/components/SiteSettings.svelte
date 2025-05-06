<script>
	import { showCookieSettings } from '../../routes/stores';
	import SoundControl from './common/SoundControl.svelte';
	import ToggleFullscreen from './common/ToggleFullscreen.svelte';
</script>

<div class="flex flex-col w-full h-auto p-1 bg-white rounded-b space-y-1 overflow-y-auto">
	<!-- <div class="w-fit max-w-full self-center"> -->
	<SoundControl />
	<!-- </div> -->
	<ToggleFullscreen />
	<!-- Cookie Settings -->
	<button
		on:click={() => ($showCookieSettings = true)}
		class="w-fit h-fit p-1 rounded-md hover:text-black text-neutral-700 self-center underline underline-offset-2 decoration-neutral-500 hover:decoration-black"
		>Cookie Settings</button
	>
</div>
