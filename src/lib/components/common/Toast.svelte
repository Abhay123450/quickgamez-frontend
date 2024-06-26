<!-- Toast.svelte -->
<script lang="ts">
	import { removeToast } from '../../../routes/stores';

	export let id: number;
	export let message: string;
	export let type: 'info' | 'success' | 'warning' | 'error';
</script>

<div class={`flex flex-row items-center toast ${type} px-2 py-1 mb-1 border rounded relative`}>
	<div>{message}</div>
	<button
		on:click={() => removeToast(id)}
		class="close flex flex-row w-5 h-5 text-xl ml-1"
		aria-label="Close"
	>
		<img class="flex" src="/icons/cross_icon.svg" alt="close" />
	</button>
</div>

<style>
	.toast.info {
		@apply bg-blue-100 border-blue-300 text-blue-700;
	}

	.toast.success {
		@apply bg-green-100 border-green-300 text-green-700;
	}

	.toast.warning {
		@apply bg-yellow-100 border-yellow-300 text-yellow-700;
	}

	.toast.error {
		@apply bg-red-100 border-red-300 text-red-700;
	}
</style>
