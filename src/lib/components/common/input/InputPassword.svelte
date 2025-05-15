<script lang="ts">
	import type { ValidationResult } from '$lib/types/ValidationResult';
	import { debounce } from '$lib/utils/debounce';
	import { generateSecureRandomString } from '$lib/utils/generateSecureRandomString';
	import { isPasswordValid } from '$lib/utils/inputValidation';
	import { Icon } from 'svelte-icons-pack';
	import { AiFillEye, AiFillEyeInvisible } from 'svelte-icons-pack/ai';

	export let name: string = '';
	export let isPasswordVisible: boolean = false;
	export let isDisabled: boolean = false;
	export let value: string = '';
	export let label: string = name;
	export let placeholder: string = name;
	export let autocomplete: string = 'off';
	export let validationErrorHandler: () => void = () => {};
	export let validationSuccessHandler: (value: string) => void = () => {};
	// Updated type definition to accept a value and return validation result
	export let className: string = '';

	let validationFunction: (val: string) => Promise<ValidationResult> | ValidationResult =
		isPasswordValid;
	let id = 'input-' + name + '-' + generateSecureRandomString(5);

	let validationMessage: string = '';
	let errorMessage: string = '';

	// Function to handle input and validation
	async function handleInput(event: Event) {
		console.info('handle input');
		const target = event.target as HTMLInputElement;
		value = target.value;

		// Call the validation function with current value
		const validationResult = await validationFunction(value);
		errorMessage = validationResult.errorMessage;
		validationMessage = validationResult?.validationMessage || '';

		if (!validationResult.isValid) {
			validationErrorHandler();
		} else {
			validationSuccessHandler(value);
		}
	}

	const debouncedHandleInput = debounce(handleInput, 500);
</script>

<div class="flex flex-col relative w-full rounded-md border border-neutral-500 {className}">
	<label
		for={id}
		class="absolute -top-3 start-2 px-1 text-sm bg-yellow-100 border border-neutral-500 text-black rounded-md"
		>{label}</label
	>
	{#if isPasswordVisible}
		<input
			{id}
			{name}
			{placeholder}
			{autocomplete}
			bind:value
			on:input={debouncedHandleInput}
			type="text"
			disabled={isDisabled}
			class={`w-full px-3 pt-3 pb-2 rounded-md ${isDisabled ? 'bg-neutral-100' : 'bg-white'}`}
			aria-invalid={errorMessage !== ''}
			aria-errormessage="{id}-error"
		/>
	{:else}
		<input
			{id}
			{name}
			{placeholder}
			{autocomplete}
			bind:value
			on:input={debouncedHandleInput}
			type="password"
			disabled={isDisabled}
			class={`w-full px-3 pt-3 pb-2 rounded-md ${isDisabled ? 'bg-neutral-100' : 'bg-white'}`}
			aria-invalid={errorMessage !== ''}
			aria-errormessage="{id}-error"
		/>
	{/if}

	<button
		type="button"
		class="flex absolute right-2 top-2.5 text-gray-600"
		on:click={() => (isPasswordVisible = !isPasswordVisible)}
	>
		{#if isPasswordVisible}
			<Icon src={AiFillEye} className="w-6 h-6" />
		{:else}
			<Icon src={AiFillEyeInvisible} className="w-6 h-6" />
		{/if}
	</button>

	<p id="{id}-error" class:hidden={errorMessage === ''} class="text-red-600 ps-1 mb-1 h-5">
		{errorMessage}
	</p>

	<p class:hidden={validationMessage === ''} class="text-emerald-600 ps-1 mb-1 h-5">
		{validationMessage}
	</p>
</div>
