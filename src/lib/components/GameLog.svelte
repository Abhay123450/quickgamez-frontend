<script lang="ts">
	import type { GameLog } from '$lib/types/GameLog';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { gameLog } from '../../routes/stores';

	function formatDate(date: Date) {
		const pad = (n: number) => n.toString().padStart(2, '0');

		const dd = pad(date.getDate());
		const mm = pad(date.getMonth() + 1); // Months are zero-indexed
		const yy = pad(date.getFullYear()); // Last two digits of year

		const hh = pad(date.getHours());
		const min = pad(date.getMinutes());
		const ss = pad(date.getSeconds());
		const ms = pad(date.getMilliseconds());

		return `${dd}-${mm}-${yy} ${hh}:${min}:${ss}`;
	}

	function getLogTypeColor(type: GameLog['type']) {
		switch (type) {
			case 'success':
				return 'bg-green-100';
			case 'error':
				return 'bg-red-100';
			case 'neutral':
				return 'bg-neutral-50';
			case 'warning':
				return 'bg-yellow-100';
			case 'info':
				return 'bg-blue-100';
			default:
				return 'bg-neutral-50';
		}
	}

	onMount(() => {
		// setInterval(() => {
		// 	gameLog = [
		// 		...gameLog,
		// 		{
		// 			timestamp: new Date(),
		// 			message: 'Your guess: A is correct',
		// 			type: 'success'
		// 		}
		// 	];
		// }, 2000);
	});

	afterUpdate(() => {
		const container = document.getElementById('gameLogContainer');
		const windowBody = container?.closest('.window-body');
		if (windowBody && windowBody.scrollHeight > windowBody.clientHeight) {
			windowBody.scrollTo({ top: windowBody.scrollHeight, behavior: 'smooth' });
		}
	});

	onDestroy(() => {
		console.log('GameLog destroyed');
	});
</script>

<div id="gameLogContainer" class="flex flex-col w-full bg-white px-0.5">
	{#each $gameLog as log}
		<div
			class={`flex flex-col px-1 pt-0.5 pb-1 border-b-[1px] border-neutral-500 justify-center ${getLogTypeColor(
				log.type
			)}`}
		>
			<p class="text-xs text-neutral-600 tracking-wider">{formatDate(log.timestamp)}</p>
			<pre class="text-base/5 text-neutral-700 text-wrap font-mono">{log.message}</pre>
		</div>
	{/each}
</div>
