<!-- Dropdown.svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	// Props for the component
	export let name: string;
	export let options: Array<{ value: string; label: string }>;
	export let defaultOption: string = options.length > 0 ? options[0].value : '';
	export let handleOptionChange: ((value: string) => void) | null = null;
	export let id: string = name.replace(/\s+/g, '-').toLowerCase();

	// Internal state
	let isOpen = false;
	let selectedOption = defaultOption;
	let dropdownRef: HTMLDivElement;
	let buttonRef: HTMLButtonElement;
	let optionRefs: HTMLDivElement[] = [];
	let focusedOptionIndex = -1;

	const dispatch = createEventDispatcher();

	// Find the label for the selected option
	$: selectedLabel = options.find((option) => option.value === selectedOption)?.label || '';

	onMount(() => {
		if (handleOptionChange) {
			handleOptionChange(selectedOption);
		}

		// Close dropdown when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			if (isOpen && dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
				focusedOptionIndex = -1;
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	// Toggle dropdown visibility
	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen) {
			// Set focus to the currently selected option when opening
			focusedOptionIndex = options.findIndex((option) => option.value === selectedOption);
			// Wait for DOM update, then focus
			setTimeout(() => {
				if (focusedOptionIndex >= 0 && optionRefs[focusedOptionIndex]) {
					optionRefs[focusedOptionIndex].focus();
				}
			}, 0);
		} else {
			focusedOptionIndex = -1;
		}
	}

	// Handle option selection
	function selectOption(value: string) {
		selectedOption = value;
		isOpen = false;

		// Call the provided handler if it exists
		if (handleOptionChange) {
			handleOptionChange(value);
		}

		// Also dispatch an event for Svelte-style handling
		dispatch('change', { value });

		// Return focus to the button after selection
		if (buttonRef) {
			buttonRef.focus();
		}
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		// When focus is on the button (focusedOptionIndex === -1)
		if (focusedOptionIndex === -1 && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			toggleDropdown();
			return;
		}

		if (!isOpen) return;

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				isOpen = false;
				focusedOptionIndex = -1;
				buttonRef?.focus();
				break;

			case 'ArrowDown':
				event.preventDefault();
				focusedOptionIndex = (focusedOptionIndex + 1) % options.length;
				optionRefs[focusedOptionIndex]?.focus();
				break;

			case 'ArrowUp':
				event.preventDefault();
				focusedOptionIndex = (focusedOptionIndex - 1 + options.length) % options.length;
				optionRefs[focusedOptionIndex]?.focus();
				break;

			case 'Enter':
			case ' ':
				if (focusedOptionIndex >= 0) {
					event.preventDefault();
					selectOption(options[focusedOptionIndex].value);
				}
				break;

			case 'Tab':
				isOpen = false;
				focusedOptionIndex = -1;
				break;

			case 'Home':
				event.preventDefault();
				focusedOptionIndex = 0;
				optionRefs[focusedOptionIndex]?.focus();
				break;

			case 'End':
				event.preventDefault();
				focusedOptionIndex = options.length - 1;
				optionRefs[focusedOptionIndex]?.focus();
				break;
		}
	}

	// Handle option keyboard events
	function handleOptionKeydown(event: KeyboardEvent, index: number, value: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			isOpen = false;
			event.preventDefault();
			selectOption(value);
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="relative w-full mt-2" bind:this={dropdownRef} on:keydown={handleKeydown}>
	<button
		type="button"
		id={`${id}-button`}
		class="flex items-center justify-between w-full px-3 pt-3 pb-2 text-left bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-labelledby={`${id}-label`}
		aria-controls={`${id}-options`}
		bind:this={buttonRef}
		on:click={toggleDropdown}
	>
		<span class="block truncate"
			>{selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)}</span
		>
		<span class="ml-2 pointer-events-none">
			<svg
				class="w-5 h-5 text-neutral-700"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	</button>

	<label
		id={`${id}-label`}
		for={`${id}-button`}
		class="absolute top-0 left-3 text-sm text-gray-700 border border-neutral-300 bg-white px-1 -translate-y-1/2 rounded"
		>{name}</label
	>

	{#if isOpen}
		<div
			id={`${id}-options`}
			class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
			role="listbox"
			aria-labelledby={`${id}-label`}
			tabindex="-1"
		>
			<div class="py-1">
				{#each options as option, index}
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<div
						bind:this={optionRefs[index]}
						id={`${id}-option-${option.value}`}
						class="flex items-center px-4 py-2 cursor-pointer hover:bg-yellow-100 focus:bg-yellow-100 focus:outline-none {selectedOption ===
						option.value
							? 'bg-yellow-200 text-black'
							: 'text-gray-900'}"
						role="option"
						aria-selected={selectedOption === option.value}
						tabindex="0"
						on:click={() => selectOption(option.value)}
						on:keydown={(e) => handleOptionKeydown(e, index, option.value)}
					>
						{option.label.charAt(0).toUpperCase() + option.label.slice(1)}
						{#if selectedOption === option.value}
							<span class="ml-auto">
								<svg
									class="w-5 h-5 text-black"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
