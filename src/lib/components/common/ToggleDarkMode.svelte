<script lang="ts">
	import { Theme } from '$lib/constants/theme.enum';
	import { theme } from '../../../routes/stores';

	function toggleTheme() {
		if ($theme === Theme.Dark) {
			theme.set(Theme.Default);
		} else {
			theme.set(Theme.Dark);
		}
	}
</script>

<div class="flex flex-row justify-center p-1">
	{#if $theme === Theme.Dark}
		<!-- Fullscreen Exit Icon -->

		<button
			on:click={toggleTheme}
			class="flex flex-row items-center px-3 py-2 border border-emerald-700 bg-emerald-300 rounded-md"
		>
			<span class="flex mr-4">Dark Mode</span>

			<span class="flex">
				<i class="w-5 h-5">
					<img src="/icons/check_icon.svg" alt="fullscreen exit" />
				</i>
			</span>
		</button>
	{:else}
		<!-- Fullscreen Enter Icon -->
		<button
			on:click={toggleTheme}
			class="flex flex-row items-center px-3 py-2 border border-neutral-500 bg-neutral-300 rounded-md"
		>
			<span class="flex mr-4">Dark Mode</span>

			<span class="flex">
				<i class="w-5 h-5">
					<img src="/icons/cross_icon.svg" alt="fullscreen exit" />
				</i>
			</span>
		</button>
	{/if}
</div>
