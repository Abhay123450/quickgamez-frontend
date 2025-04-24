<!-- Toast.svelte -->
<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { removeToast } from '../../../routes/stores';
	import { CgClose } from 'svelte-icons-pack/cg';

	export let id: number;
	export let message: string;
	export let type: 'info' | 'success' | 'warning' | 'error';
</script>

<div class={`flex flex-row items-center toast ${type} px-2 py-1 mb-1 border rounded relative`}>
	<div>{message}</div>
	<button
		on:click={() => removeToast(id)}
		class="close flex flex-row flex-shrink-0 w-5 h-5 text-xl ml-1 text-black"
		aria-label="Close"
	>
		<Icon src={CgClose} className="w-5 h-5" />
	</button>
</div>

<style>
	.toast.info {
		@apply bg-blue-100 border-blue-400 text-blue-800;
	}

	.toast.success {
		@apply bg-green-100 border-green-400 text-green-800;
	}

	.toast.warning {
		@apply bg-yellow-100 border-yellow-400 text-yellow-800;
	}

	.toast.error {
		@apply bg-red-100 border-red-400 text-red-800;
	}
</style>
