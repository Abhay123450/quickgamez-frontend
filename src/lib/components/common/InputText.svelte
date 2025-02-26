<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemErrorWarningLine } from 'svelte-icons-pack/ri';

	export let name: string;
	export let text: string = '';
	export let minLength: number = 1;
	export let isOptional: boolean = false;
	export let errorMessage: string = '';

	let isValidData = true;

	function validateText() {
		if (!isOptional && text.length < minLength) {
			errorMessage = name + ' must be at least ' + minLength + ' characters';
		} else {
			errorMessage = '';
		}
		isValidData = !errorMessage;
	}
</script>

<div class="relative flex flex-col mt-2">
	<input
		{name}
		type="text"
		minlength={minLength}
		bind:value={text}
		on:input={validateText}
		class="w-full px-4 py-2 border border-gray-500 rounded shadow-sm"
		placeholder={name}
		aria-label={`Enter ${name}`}
		aria-required={!isOptional}
		aria-invalid={text.length < minLength}
		spellcheck="false"
	/>

	<p class="text-red-500 text-sm ps-1 h-5">{errorMessage}</p>

	{#if !isValidData}
		<div class="flex absolute right-2 top-2 text-red-500">
			<Icon src={RiSystemErrorWarningLine} className="w-6 h-6" />
		</div>
	{/if}
</div>
