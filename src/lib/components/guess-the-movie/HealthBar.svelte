<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount, afterUpdate } from 'svelte';

	export let maxHearts = 5;
	export let heartsLeft = 5;

	interface Heart {
		visible: boolean;
	}

	// export let isPlaying = false;
	let heartsInfo: Heart[] = [];
	$: for (let i = 0; i < maxHearts; i++) {
		heartsInfo = [...heartsInfo, { visible: true }];
	}

	$: if (heartsLeft < maxHearts && heartsLeft >= 0) {
		heartsInfo[heartsLeft].visible = false;
	}
</script>

<div id="healthBar" class="flex space-x-1 align-middle">
	<!-- {#each heartsInfo as heart}
		{#if heart.visible}
			<div out:fly={{ y: 50, duration: 2000 }} in:fly={{ y: 10, duration: 1000 }}>
				<svg
					class="h-6 w-6 text-red-500 fill-current"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 21.35l-1.45-1.36C6.48 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.48 6.86-8.55 11.49L12 21.35z"
					/>
				</svg>
			</div>
		{/if}
	{/each} -->
	{#each { length: heartsLeft } as _, i}
		<div out:fly={{ y: 50, duration: 3000 }} in:fly={{ y: 20, duration: 1000 }}>
			<svg
				class="h-6 w-6 text-red-500 fill-current"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 21.35l-1.45-1.36C6.48 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.48 6.86-8.55 11.49L12 21.35z"
				/>
			</svg>
		</div>
	{/each}
</div>
