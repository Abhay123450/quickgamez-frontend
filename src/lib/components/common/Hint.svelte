<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Icon } from 'svelte-icons-pack';
	import { BiLock } from 'svelte-icons-pack/bi';
	import { TrFillBulb } from 'svelte-icons-pack/tr';

	export let hint: string = '';
	export let isLocked: boolean = true;
	export let newHintDiv: HTMLDivElement;
</script>

<div
	class="flex justify-around w-auto h-fit mx-2 my-1 border border-neutral-500 rounded-md bg-neutral-100"
>
	{#if isLocked}
		<div class="flex w-full p-1 items-center justify-center bg-neutral-300 rounded-md">
			<i class="h-6 w-6 text-neutral-700">
				<Icon src={BiLock} className="w-6 h-6" />
			</i>
			<p class="ps-1">This hint is locked. Every wrong guess unlocks a new hint.</p>
		</div>
	{:else}
		<div
			bind:this={newHintDiv}
			class="flex w-full p-1 items-center bg-neutral-50 rounded-md
			dark:bg-black"
			in:fade={{ duration: 1500 }}
		>
			<i class="h-6 w-6 flex-shrink-0 text-black dark:text-white">
				<Icon src={TrFillBulb} className="w-6 h-6" />
			</i>
			<p class="pl-1 font-mono text-black dark:text-neutral-300">{hint}</p>
		</div>
	{/if}
</div>
