<script lang="ts">
	import { scale, slide } from 'svelte/transition';

	export let character: string;
	export let isGuessed: boolean;
	export let isGuessedByUser: boolean;
</script>

<div class="flex w-8 h-8 md:w-10 md:h-10 items-center px-1 justify-center my-1 md:my-2">
	{#if isGuessed && isGuessedByUser}
		<input
			transition:slide={{ duration: 300, axis: 'y' }}
			type="text"
			class=" w-full h-full text-center text-2xl border-b-2 border-black rounded-t focus:outline-none bg-green-300 opacity-100 origin-top"
			value={character}
			aria-label="{character} is guessed"
			disabled
		/>
	{:else if character === ' '}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl focus:outline-none bg-transparent"
			value=" "
			aria-label="Space"
			disabled
		/>
	{:else if isGuessed && !isGuessedByUser}
		<input
			type="text"
			class=" w-full h-full text-center text-xl border-b-2 border-black rounded-t bg-transparent focus:outline-none opacity-100"
			value={character}
			aria-label="{character}, is guessed"
			disabled
		/>
	{:else}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl border-b-2 border-black rounded-t focus:outline-none bg-white opacity-100 border-solid"
			aria-label="Empty, not guessed"
			disabled
		/>
	{/if}
</div>
