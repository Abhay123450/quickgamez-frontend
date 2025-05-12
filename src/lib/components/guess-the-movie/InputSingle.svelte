<script lang="ts">
	import { scale } from 'svelte/transition';

	export let character: string;
	export let isGuessed: boolean;
	export let isGuessedByUser: boolean;
</script>

<div class="flex w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-md mx-1 my-2 md:mx-2">
	{#if isGuessed && isGuessedByUser}
		<input
			transition:scale={{ duration: 500 }}
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-green-300 opacity-100"
			value={character}
			aria-label="{character} is guessed"
			disabled
		/>
	{:else if character === ' '}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-transparent"
			value=" "
			aria-label="Space"
			disabled
		/>
	{:else if isGuessed && !isGuessedByUser}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-neutral-100 opacity-100"
			value={character}
			aria-label="{character}, is guessed"
			disabled
		/>
	{:else}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-white opacity-100 border border-solid border-gray-500"
			aria-label="Empty, not guessed"
			disabled
		/>
	{/if}
</div>
