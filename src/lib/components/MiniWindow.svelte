<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { Icon, type IconType } from 'svelte-icons-pack';
	import { FiMinus, FiPlus } from 'svelte-icons-pack/fi';
	import { refreshRightPanel } from '../../routes/stores';

	export let isMaximized: boolean = false;
	export let title: string = 'Title';
	export let icon: IconType;

	export let clientHeight: number = 0;

	const id = 'window-title-' + title.split(' ').join('-');

	function toggleMaximize() {
		isMaximized = !isMaximized;
		if (isMaximized) {
			dispatch('maximize');
		} else {
			dispatch('minimize');
		}
		$refreshRightPanel = !$refreshRightPanel;
	}
</script>

<section
	bind:clientHeight
	class="flex flex-col w-full h-fit max-h-full rounded-md"
	aria-labelledby={`${id}`}
>
	<!-- head -->
	<button
		on:click={toggleMaximize}
		class="flex flex-row w-full h-8 px-1 space-x-1 border rounded-md border-neutral-500 bg-yellow-200 align-middle shrink-0 sticky top-0"
	>
		<Icon src={icon} className="w-6 h-6 self-center" />
		<h2 id={`${id}`} class="w-full h-fit p-1 self-center text-left">
			{title}
		</h2>
		<div class="flex flex-row w-fit h-full space-x-1">
			<Icon
				src={isMaximized ? FiMinus : FiPlus}
				className="w-6 h-6 self-center hover:shadow-inner"
			/>
		</div>
	</button>
	<!-- body -->
	{#key isMaximized}
		<div
			class="w-full h-auto overflow-auto scrollbar-thin window-body"
			in:slide={{ duration: 400 }}
			out:slide={{ duration: 400 }}
			class:hidden={!isMaximized}
		>
			<slot></slot>
		</div>
	{/key}
</section>
