<script lang="ts">
	import type { ValidationResult } from '$lib/types/ValidationResult';
	import { debounce } from '$lib/utils/debounce';
	import { generateSecureRandomString } from '$lib/utils/generateSecureRandomString';
	import { Icon } from 'svelte-icons-pack';
	import { BiEdit } from 'svelte-icons-pack/bi';

	export let label: string = '';
	export let name: string = '';
	export let value: string = '';
	export let isDisabled: boolean = true;
	export let isEditable: boolean = true;
	export let validationErrorHandler: () => void = () => {};
	export let validationSuccessHandler: (value: string) => void = () => {};
	// Updated type definition to accept a value and return validation result
	export let validationFunction: (
		val: string
	) => Promise<ValidationResult> | ValidationResult = () => ({
		isValid: true,
		errorMessage: '',
		validationMessage: ''
	});

	let id = 'input-' + name + '-' + generateSecureRandomString(5);

	let validationMessage: string = '';
	let errorMessage: string = '';

	function toggleDisable() {
		isDisabled = !isDisabled;
	}

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

<div class="flex flex-col relative w-full rounded-md border border-neutral-500">
	<label
		for={id}
		class="absolute -top-3 start-2 px-1 text-sm bg-yellow-100 border border-neutral-500 text-black rounded-md"
		>{label}</label
	>
	<input
		{id}
		{name}
		{value}
		on:input={debouncedHandleInput}
		type="text"
		disabled={isDisabled}
		class={`w-full px-3 pt-3 pb-2 rounded-md ${isDisabled ? 'bg-neutral-100' : 'bg-white'}`}
		aria-invalid={errorMessage !== ''}
		aria-errormessage="{id}-error"
	/>
	{#if errorMessage !== ''}
		<p id="{id}-error" class="text-red-600 ps-1 mb-1 h-5">{errorMessage}</p>
	{:else if validationMessage !== ''}
		<p class="text-emerald-600 ps-1 mb-1 h-5">{validationMessage}</p>
	{/if}
	{#if isEditable}
		<button
			type="button"
			on:click|stopPropagation={toggleDisable}
			class="absolute right-1 top-1.5 rounded-md p-1 hover:bg-neutral-300"
		>
			<Icon src={BiEdit} className="w-6 h-6" />
		</button>
	{/if}
</div>
