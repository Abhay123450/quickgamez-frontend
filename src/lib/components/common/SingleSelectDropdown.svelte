<!-- src/SingleSelectDropdown.svelte -->
<script lang="ts">
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let options: string[] = [];
	export let selected: string = '';

	const dispatch: EventDispatcher<any> = createEventDispatcher();

	function handleSelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		selected = target.value;
		dispatch('select', selected);
	}
</script>

<select
	on:change={handleSelect}
	value={selected || options[0]}
	class="block w-full mt-2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
	<!-- <option value="" disabled>Select an option</option> -->
	{#each options as option}
		<option value={option}>{option}</option>
	{/each}
</select>

<style>
	/* Custom styles if needed */
</style>
