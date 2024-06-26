<script lang="ts">
	import { alphabet, qwerty, numbers } from '$lib/constants/alphabet.js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function clicked(e: any) {
		dispatch('input', {
			isClicked: true,
			char: e.target.innerText
		});
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

<div
	id="keyboard-buttons-parent"
	class="flex flex-wrap py-2 justify-center w-full max-w-full bg-teal-200 dark:bg-black dark:text-gray-200 p-0 md:p-2 box-border"
>
	{#if false}
		{#each numbers as number}
			{#if disabledKeys.includes(number.toString())}
				<button
					class="w-11 h-11 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
					disabled={true}
					>{number}
				</button>
			{:else}
				<button
					on:click={clicked}
					class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black bg-white"
					>{number}
				</button>
			{/if}
		{/each}

		<!-- <button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">1</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">2</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">3</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">4</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">5</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">6</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">7</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">8</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">9</button>
		<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">0</button> -->
	{/if}

	{#if isQwerty}
		<div class="flex flex-col">
			{#if isNumRow}
				<div class="flex justify-center max-w-full">
					{#each numbers as number}
						{#if disabledKeys.includes(number.toString())}
							<button
								class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
								disabled={true}
								>{number}
							</button>
						{:else}
							<button
								on:click={clicked}
								class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
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
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
							disabled={true}
							>{letter}
						</button>
					{:else}
						<button
							on:click={clicked}
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
							>{letter}
						</button>
					{/if}
				{/each}
				<!-- <button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">Q</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">W</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">E</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">R</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">T</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">Y</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">U</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">I</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">O</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">P</button> -->
			</div>

			<div class="flex justify-center">
				{#each qwertySecondRow as letter}
					{#if disabledKeys.includes(letter)}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
							disabled={true}
							>{letter}
						</button>
					{:else}
						<button
							on:click={clicked}
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
							>{letter}
						</button>
					{/if}
				{/each}
				<!-- <button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">A</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">S</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">D</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">F</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">G</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">H</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">J</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">K</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">L</button> -->
			</div>

			<div class="flex justify-center">
				{#each qwertyThirdRow as letter}
					{#if disabledKeys.includes(letter)}
						<button
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
							disabled={true}
							>{letter}
						</button>
					{:else}
						<button
							on:click={clicked}
							class="w-9 h-9 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
							>{letter}
						</button>
					{/if}
				{/each}
				<!-- <button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">Z</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">X</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">C</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">V</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">B</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">N</button>
				<button class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black">M</button> -->
			</div>
		</div>
	{:else}
		<!-- no qwerty -->
		{#if isNumRow}
			{#each numbers as number}
				{#if disabledKeys.includes(number.toString())}
					<button
						class="w-11 h-11 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
						disabled={true}
						>{number}
					</button>
				{:else}
					<button
						on:click={clicked}
						class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
						>{number}
					</button>
				{/if}
			{/each}
		{/if}
		{#each alphabet as letter}
			{#if disabledKeys.includes(letter)}
				<button
					class="w-11 h-11 md:w-12 md:h-12 border rounded-md disabled bg-gray-300"
					disabled={true}
					>{letter}
				</button>
			{:else}
				<button
					on:click={clicked}
					class="w-11 h-11 md:w-12 md:h-12 border rounded-md hover:border-black bg-white dark:bg-black dark:text-gray-200"
					>{letter}
				</button>
			{/if}
		{/each}
	{/if}
</div>
