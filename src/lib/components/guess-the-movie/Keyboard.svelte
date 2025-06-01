<script lang="ts">
	import { alphabet, qwerty, numbers } from '$lib/constants/alphabet.js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let bgColor: string = 'bg-teal-200';

	function clicked(e: any) {
		if (e.target.tagName === 'BUTTON') {
			e.stopPropagation();
			dispatch('input', {
				isClicked: true,
				char: e.target.innerText
			});
		}
	}

	let qwertyFirstRow: string[] = qwerty.slice(0, 10);
	let qwertySecondRow: string[] = qwerty.slice(10, 19);
	let qwertyThirdRow: string[] = qwerty.slice(19, 26);

	// console.log(qwertyFirstRow, qwertySecondRow, qwertyThirdRow);

	export let disabledKeys: string[] = [];
	export let isQwerty: boolean = false;
	export let isNumRow: boolean = true;
	// export let addToDisabledKeys: string = '';

	// $: disabledKeys = [...disabledKeys, addToDisabledKeys];
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={clicked}
	id="keyboard-buttons-parent"
	class="flex flex-wrap py-2 justify-center w-full max-w-full {bgColor} dark:text-gray-200 p-0 md:p-2 box-border"
>
	{#if isQwerty}
		<div class="flex flex-col">
			{#if isNumRow}
				<div class="flex justify-center max-w-full">
					{#each numbers as number}
						{#if disabledKeys.includes(number.toString())}
							<button
								class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300 dark:bg-gray-400"
								disabled={true}
								>{number}
							</button>
						{:else}
							<button
								class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black dark:hover:border-gray-200 bg-white dark:bg-black dark:text-gray-200"
								>{number}
							</button>
						{/if}
					{/each}
				</div>
			{/if}
			<div class="flex justify-center max-w-full">
				{#each qwertyFirstRow as letter}
					{#if disabledKeys.includes(letter)}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300 dark:bg-gray-400"
							disabled={true}
							>{letter}
						</button>
					{:else}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black dark:hover:border-gray-200 bg-white dark:bg-black dark:text-gray-200"
							>{letter}
						</button>
					{/if}
				{/each}
			</div>

			<div class="flex justify-center">
				{#each qwertySecondRow as letter}
					{#if disabledKeys.includes(letter)}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300 dark:bg-gray-400"
							disabled={true}
							>{letter}
						</button>
					{:else}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black dark:hover:border-gray-200 bg-white dark:bg-black dark:text-gray-200"
							>{letter}
						</button>
					{/if}
				{/each}
			</div>

			<div class="flex justify-center">
				{#each qwertyThirdRow as letter}
					{#if disabledKeys.includes(letter)}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300 dark:bg-gray-400"
							disabled={true}
							>{letter}
						</button>
					{:else}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
							>{letter}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	{:else}
		<!-- no qwerty -->
		{#if isNumRow}
			{#each numbers as number}
				{#if disabledKeys.includes(number.toString())}
					<button
						class="w-11 h-11 md:w-12 md:h-12 border rounded-md disabled bg-gray-300 dark:bg-gray-400"
						disabled={true}
						>{number}
					</button>
				{:else}
					<button
						class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black dark:hover:border-gray-200 bg-white dark:bg-black dark:text-gray-200"
						>{number}
					</button>
				{/if}
			{/each}
		{/if}
		{#each alphabet as letter}
			{#if disabledKeys.includes(letter)}
				<button
					class="w-11 h-11 md:w-12 md:h-12 border rounded-md disabled bg-gray-300 dark:bg-gray-400"
					disabled={true}
					>{letter}
				</button>
			{:else}
				<button
					class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black dark:hover:border-gray-200 bg-white dark:bg-black dark:text-gray-200"
					>{letter}
				</button>
			{/if}
		{/each}
	{/if}
</div>
