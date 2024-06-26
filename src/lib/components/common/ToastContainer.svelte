<!-- ToastContainer.svelte -->
<script lang="ts">
	import { toasts } from '../../../routes/stores';
	import Toast from './Toast.svelte';
	import { fade, fly } from 'svelte/transition';

	$: toastList = $toasts;
</script>

<!-- for center horizontal  add "max-w-max mx-auto inset-x-0" -->
<div
	class="toast-container fixed bottom-60 lg:bottom-8 right-1 z-50 flex flex-col items-end space-y-1"
>
	{#each toastList as { id, message, type } (id)}
		<div in:fly={{ x: 200, duration: 500 }} out:fly={{ x: 200, duration: 1000 }}>
			<Toast {id} {message} {type} />
		</div>
	{/each}
</div>
