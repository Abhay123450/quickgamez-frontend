<script lang="ts">
	import { createEventDispatcher, type EventDispatcher } from 'svelte';

	export let isChecked = false;
	export let label: string = '';

	const dispatch: EventDispatcher<any> = createEventDispatcher();

	function handleToggle(event: Event) {
		dispatch('toggle', isChecked);
	}
</script>

<div class="flex flex-row justify-center p-1">
	{#if isChecked}
		<!-- Fullscreen Exit Icon -->

		<button
			on:click={handleToggle}
			class="flex flex-row items-center px-3 py-2 border border-emerald-700 bg-emerald-300 rounded-md"
		>
			<span class="flex mr-4">{label}</span>

			<span class="flex">
				<i class="w-5 h-5">
					<img src="/icons/check_icon.svg" alt="ON" />
				</i>
			</span>
		</button>
	{:else}
		<!-- Fullscreen Enter Icon -->
		<button
			on:click={handleToggle}
			class="flex flex-row items-center px-3 py-2 border border-neutral-500 bg-neutral-200 rounded-md"
		>
			<span class="flex mr-4">{label}</span>

			<span class="flex">
				<i class="w-5 h-5">
					<img src="/icons/cross_icon.svg" alt="OFF" />
				</i>
			</span>
		</button>
	{/if}
</div>
