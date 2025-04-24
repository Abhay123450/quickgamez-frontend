<script lang="ts">
	import { soundVolume } from '../../../routes/stores';
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { Icon, type IconType } from 'svelte-icons-pack';
	import { IoClose } from 'svelte-icons-pack/io';
	import type { Tab } from './Tabs';

	const dispatch = createEventDispatcher();

	export let tabs: Tab[];
	export let activeTab: string;
	export let showIcon: boolean = true;

	activeTab = tabs[0].name;
	let audioClickTab: HTMLAudioElement;
	let audioHoverTab: HTMLAudioElement;

	const tab1Id = new Date().getTime().toString() + 'tab1';
	const tab2Id = new Date().getTime().toString() + 'tab2';
	const tab3Id = new Date().getTime().toString() + 'tab3';
	const tab4Id = new Date().getTime().toString() + 'tab4';

	const panel1Id = new Date().getTime().toString() + 'panel1';
	const panel2Id = new Date().getTime().toString() + 'panel2';
	const panel3Id = new Date().getTime().toString() + 'panel3';
	const panel4Id = new Date().getTime().toString() + 'panel4';

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
		class="relative flex flex-row flex-shrink-0 self-center z-50 my-1 w-fit max-w-full h-fit bg-white rounded-md overflow-x-scroll no-scrollbar"
		role="tablist"
		aria-orientation="horizontal"
	>
		{#each tabs as { name: tab, icon }, index}
			<button
				class="flex flex-row w-auto p-2 m-1 rounded-md hover:bg-yellow-300 border text-black
				{tab === activeTab ? 'bg-yellow-300 border-black' : 'bg-white border-white'}"
				on:mouseenter={() => playAudio('hover', 0.18)}
				on:click|stopPropagation={() => {
					selectTab(tab);
				}}
				aria-label="{tab} tab"
				role="tab"
				aria-selected={tab === activeTab}
				id={index === 0 ? tab1Id : index === 1 ? tab2Id : index === 2 ? tab3Id : tab4Id}
				aria-controls={index === 0
					? panel1Id
					: index === 1
						? panel2Id
						: index === 2
							? panel3Id
							: panel4Id}
			>
				{#if showIcon && icon}
					<!-- <i class="flex w-6 h-6 mr-1"
						><img src="/icons/{tab.toLocaleLowerCase()}_icon.svg" alt="{tab} icon" /></i
					> -->

					<Icon className="w-6 h-6 mr-1" src={icon} />
				{/if}
				<!-- <Icon className="w-5 h-5" src={tab.toLocaleLowerCase()} /> -->
				<p>{tab}</p>
			</button>
		{/each}
		<!-- <div class="absolute right-0 self-center bg-black bg-opacity-50 w-8 h-8">more</div> -->
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={tabs.length < 0 || activeTab !== tabs[0].name}
		role="tabpanel"
		aria-labelledby={tab1Id}
		id={panel1Id}
		in:fly={{ y: 50, duration: 300 }}
		out:fly={{ y: 50, duration: 300 }}
	>
		<slot name="tab1" />
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={tabs.length < 2 || activeTab !== tabs[1].name}
		role="tabpanel"
		aria-labelledby={tab2Id}
		id={panel2Id}
	>
		<slot name="tab2" />
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={tabs.length < 3 || activeTab !== tabs[2].name}
		role="tabpanel"
		aria-labelledby={tab3Id}
		id={panel3Id}
	>
		<slot name="tab3" />
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={tabs.length < 4 || activeTab !== tabs[3].name}
		role="tabpanel"
		aria-labelledby={tab4Id}
		id={panel4Id}
	>
		<slot name="tab4" />
	</div>
</div>
