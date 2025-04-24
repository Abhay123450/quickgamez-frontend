<script lang="ts">
	import { trapFocus } from '$lib/actions';
	import { fade, fly } from 'svelte/transition';

	export let title: string | null = null;
	export let message: string;
	export let btnTextPositive: string = 'OK';
	export let btnTextNegative: string = 'NO';
	export let showNegativeBtn: boolean = false;
	export let isCancellable: boolean = true;
	export let callbackFunctionPositive: () => void = () => {};
	export let callbackFunctionNegative: () => void = () => {};
	export let callbackFunctionCancel: () => void = () => {
		history.back();
		console.log('history callback cancel', history);
	};
</script>

<div
	use:trapFocus
	class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex flex-col items-center justify-center z-50
	{isCancellable ? 'cursor-pointer' : ''}"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
	on:click={isCancellable ? callbackFunctionCancel : () => {}}
	on:keydown={(e) => {
		if (e.key === 'Escape' && isCancellable) {
			callbackFunctionCancel();
		}
	}}
	role={isCancellable ? 'button' : ''}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog
		open
		class="flex flex-col w-[95%] md:w-fit max-w-xl px-3 py-2 rounded-md shadow-md bg-white space-y-1 cursor-auto"
		on:click|stopPropagation
		in:fly={{ y: 50, duration: 300 }}
		out:fly={{ y: 50, duration: 300 }}
		aria-modal="true"
	>
		{#if title}
			<p class="text-lg font-semibold">{title}</p>
		{/if}
		<p class="text-base pb-1">{message}</p>
		<div class="flex flex-row w-fit space-x-1 self-end">
			{#if isCancellable}
				<button
					class="flex w-fit h-fit px-4 py-0.5 rounded-md bg-gray-600 text-white text-lg self-center"
					on:click|stopPropagation={callbackFunctionCancel}
				>
					Cancel
				</button>
			{/if}
			{#if showNegativeBtn}
				<button
					class="flex w-fit h-fit px-4 py-0.5 rounded-md bg-gray-600 text-white text-lg self-center"
					on:click|stopPropagation={callbackFunctionNegative}
				>
					{btnTextNegative}
				</button>
			{/if}
			<button
				class="flex w-fit h-fit px-4 py-0.5 rounded-md bg-red-600 text-white text-lg self-center"
				on:click|stopPropagation={callbackFunctionPositive}
			>
				{btnTextPositive}
			</button>
		</div>
	</dialog>
</div>
