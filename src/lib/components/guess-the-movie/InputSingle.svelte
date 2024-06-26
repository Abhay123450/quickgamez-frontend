<script lang="ts">
	// export let charObj = {};
	// let char = charObj.char;
	// let isGuessed = charObj.isGuessed;
	// let isGuessedByUser = charObj.isGuessedByUser;
	export let character: string;
	export let isGuessed: boolean;
	export let isGuessedByUser: boolean;
</script>

<div class="flex w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-md mx-1 my-2 md:mx-2">
	{#if isGuessed && isGuessedByUser}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-green-300"
			value={character}
			disabled
		/>
	{:else if character === ' '}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-transparent"
			disabled
		/>
	{:else if isGuessed && !isGuessedByUser}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-neutral-100"
			value={character}
			disabled
		/>
	{:else}
		<input
			type="text"
			class=" w-full h-full text-center text-2xl rounded-md focus:outline-none bg-white border border-solid border-gray-500"
			disabled
		/>
	{/if}
</div>
