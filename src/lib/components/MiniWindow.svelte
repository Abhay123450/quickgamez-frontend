<script lang="ts">
	import { fly, scale, slide } from 'svelte/transition';
	import { afterUpdate, onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { Icon, type IconType } from 'svelte-icons-pack';
	import { FiMinus, FiPlus } from 'svelte-icons-pack/fi';
	import { refreshRightPanel } from '../../routes/stores';

	export let isMaximized: boolean = false;
	export let title: string = 'Title';
	export let icon: IconType;
	export let seekAttention: boolean = false;

	function toggleMaximize() {
		isMaximized = !isMaximized;
		if (isMaximized) {
			dispatch('maximize');
		} else {
			dispatch('minimize');
		}
		$refreshRightPanel = !$refreshRightPanel;
		console.info(`toggleMaximize ${isMaximized}`);
		console.info(`refreshRightPanel ${$refreshRightPanel}`);
	}

	onMount(() => {
		setInterval(() => {
			seekAttention = !seekAttention;
			// setTimeout(() => {
			// 	seekAttention = !seekAttention;
			// }, 500);
		}, 5000);
		// title === 'My Account' && (isMaximized = false);
	});
</script>

<div class="flex flex-col w-full h-fit max-h-full rounded-md">
	<!-- head -->
	<button
		on:click={toggleMaximize}
		class="flex flex-row w-full h-8 px-1 space-x-1 rounded border border-neutral-500 bg-yellow-200 align-middle shrink-0 sticky top-0"
	>
		<Icon src={icon} className="w-6 h-6 self-center" />
		<p class="w-full h-fit p-1 self-center text-left">{title}</p>
		<div class="flex flex-row w-fit h-full space-x-1">
			<!-- <div
				class="flex flex-col w-6 h-6 self-center text-center rounded-md active:shadow-inner text-neutral-800"
			> -->
			<Icon
				src={isMaximized ? FiMinus : FiPlus}
				className="w-6 h-6 self-center hover:shadow-inner"
			/>
			<!-- </div> -->

			<!-- <button class="flex w-6 h-6 self-center rounded-md active:shadow-inner text-neutral-600">
		<Icon src={IoClose} className="w-full h-full" />
		</button> -->
		</div>
	</button>
	<!-- body -->
	{#if isMaximized}
		<div
			class="w-full h-auto overflow-auto scrollbar-thin"
			in:slide={{ duration: 400 }}
			out:slide={{ duration: 400 }}
		>
			<slot></slot>
		</div>
	{/if}
</div>

<style>
	@keyframes attention {
		0% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}

	.custom-border::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1px solid gray;
		border-radius: 0.2rem;
		box-sizing: border-box;
	}

	/* .scrollbar-thin {
		scrollbar-width: thin;
	} */
</style>
