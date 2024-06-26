<script lang="ts">
	import { isLeftPanelOpen, addToast } from '../../../routes/stores';
	// let isLeftOpen = false;

	function toggleLeftPanel() {
		isLeftPanelOpen.update((isOpen) => !isOpen);
	}
</script>

<div class="flex flex-row w-full justify-between rounded-md border bg-white lg:hidden">
	<a href="/">
		<img class="w-40 self-center lg:hidden" src="/images/logo.webp" alt="logo" />
	</a>
	<button on:click={toggleLeftPanel} class="w-9 h-9 m-1 p-1 rounded bg-white text-white uppercase">
		<i>
			<img class="flex w-full h-full" src="/icons/menu_icon.svg" alt="menu" />
		</i>
	</button>
</div>
