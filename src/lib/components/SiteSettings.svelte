<script>
	import SoundControl from './common/SoundControl.svelte';
	import ToggleFullscreen from './common/ToggleFullscreen.svelte';
</script>

<div class="flex flex-col w-full h-auto p-1 bg-white rounded-b space-y-1 overflow-y-auto">
	<!-- <div class="w-fit max-w-full self-center"> -->
	<SoundControl />
	<!-- </div> -->
	<ToggleFullscreen />
</div>
