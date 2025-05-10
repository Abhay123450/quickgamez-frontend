<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { CgSpinner } from 'svelte-icons-pack/cg';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let text: string;
	export let isLoading = false;
	export let isDisabled = false;
</script>

<div class="flex flex-col w-full h-fit">
	{#if isLoading}
		<Icon src={CgSpinner} className="w-9 h-9 animate-spin self-center" />
	{:else}
		<button
			disabled={isDisabled}
			class="w-full h-fit border rounded-md p-2 mt-2 bg-red-500 text-white text-base font-medium tracking-wider {isDisabled
				? 'opacity-50'
				: 'hover:shadow-md active:shadow-inner opacity-100'}
        "
			type="submit">{text}</button
		>
	{/if}
</div>
