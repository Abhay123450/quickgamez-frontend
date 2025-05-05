<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let options: string[];
	let selectedOption: string = options[0];

	function handleOptionChange(option: string) {
		return function () {
			selectedOption = option;
			console.log(`Selected option`, selectedOption);
			dispatch('change', selectedOption);
		};
	}

	onMount(() => {
		handleOptionChange(options[0])();
	});
</script>

<div class="flex flex-row max-w-fit border border-neutral-400 p-1 rounded-md">
	{#each options as option}
		<button
			on:click={handleOptionChange(option)}
			class="px-4 py-1 text-base rounded-md"
			class:bg-yellow-300={option === selectedOption}
		>
			{option}
		</button>
	{/each}
</div>
