<script lang="ts">
	import { soundVolume } from '../../routes/stores';
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let tabs: string[];
	export let activeTab: string;
	export let showIcon: boolean = true;

	activeTab = tabs[0];
	let audioClickTab: HTMLAudioElement;
	let audioHoverTab: HTMLAudioElement;

	function selectTab(tab: string) {
		playAudio('click', 0.06);
		activeTab = tab;
	}

	function playAudio(audio: 'click' | 'hover' = 'click', startTime = 0) {
		if (audio === 'click') {
			if (!audioClickTab) return;
			audioClickTab.currentTime = startTime;
			audioClickTab.volume = $soundVolume;
			audioClickTab.play();
		}
		if (audio === 'hover') {
			if (!audioHoverTab) return;
			audioHoverTab.currentTime = startTime;
			audioHoverTab.volume = $soundVolume;
			audioHoverTab.play();
		}
	}
</script>

<audio class="hidden" bind:this={audioClickTab} src="/audio/keyboard.mp3" />
<audio class="hidden" bind:this={audioHoverTab} src="/audio/clickselect.mp3" />

<div
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 300 }}
	class="flex flex-col w-full h-full bg-black bg-opacity-50 overflow-y-auto no-scrollbar cursor-auto"
>
	<div
		in:fly={{ y: -50, duration: 300 }}
		out:fly={{ y: -50, duration: 300 }}
		class="flex flex-row flex-shrink-0 self-center z-50 my-1 w-fit max-w-full h-fit bg-white rounded-md overflow-x-scroll no-scrollbar"
	>
		{#each tabs as tab}
			<button
				class="flex flex-row w-auto p-2 m-1 rounded-md hover:bg-yellow-300 border
				{tab === activeTab ? 'bg-yellow-300 border-black' : 'bg-white border-white'}"
				on:mouseenter={() => playAudio('hover', 0.18)}
				on:click|stopPropagation={() => {
					selectTab(tab);
				}}
				aria-label="{tab} tab"
			>
				{#if showIcon}
					<i class="flex w-6 h-6 mr-1"
						><img src="/icons/{tab.toLocaleLowerCase()}_icon.svg" alt="{tab} icon" /></i
					>
				{/if}
				<!-- <Icon className="w-5 h-5" src={tab.toLocaleLowerCase()} /> -->
				<p>{tab}</p>
			</button>
		{/each}
	</div>
	<div
		in:fly={{ y: 50, duration: 300 }}
		out:fly={{ y: 50, duration: 300 }}
		class="flex-grow overflow-auto"
	>
		{#if activeTab === tabs[0]}
			<slot name="tab1" />
		{:else if activeTab === tabs[1]}
			<slot name="tab2" />
		{:else if activeTab === tabs[2]}
			<slot name="tab3" />
		{:else if activeTab === tabs[3]}
			<slot name="tab4" />
		{/if}
	</div>
</div>
