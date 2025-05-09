<script lang="ts">
	import { soundVolume } from '../../../routes/stores';
	import { fade, fly } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import type { Tab } from './Tabs';
	import { page } from '$app/stores';
	import { pushState, replaceState } from '$app/navigation';

	export let tabs: Tab[];
	export let activeTab: string;
	export let showIcon: boolean = true;
	export let shallowRouteMode: 'none' | 'home-tab-only' | 'all' = 'none';
	export let context: 'gametab' | 'logintab';

	const stateVariablename: 'guessTheMovieActiveTab' | 'loginActiveTab' = getStateVariableName();

	function getStateVariableName() {
		switch (context) {
			case 'gametab':
				return 'guessTheMovieActiveTab';
			case 'logintab':
				return 'loginActiveTab';
			default:
				return 'guessTheMovieActiveTab';
		}
	}

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

	function selectTab(tabName: string) {
		playAudio('click', 0.06);
		activeTab = tabName;
		if ($page.state[stateVariablename] === undefined) {
			$page.state[stateVariablename] = 0;
		}
		let currentTabIndex = $page.state[stateVariablename];
		if (tabs[currentTabIndex].name === tabName) {
			// already selected
			return;
		}
		if (shallowRouteMode === 'none') {
			replaceState('', {
				...$page.state,
				[stateVariablename]: tabs.findIndex((t) => t.name === tabName)
			});
		} else if (shallowRouteMode === 'home-tab-only') {
			if (currentTabIndex === undefined || currentTabIndex === 0) {
				pushState('', {
					...$page.state,
					[stateVariablename]: tabs.findIndex((t) => t.name === tabName)
				});
			} else {
				replaceState('', {
					...$page.state,
					[stateVariablename]: tabs.findIndex((t) => t.name === tabName)
				});
			}
		} else {
			pushState('', {
				...$page.state,
				[stateVariablename]: tabs.findIndex((t) => t.name === tabName)
			});
		}

		console.log(`activeTab: ${activeTab}`);
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

	function isCurrentTabSelected(tabName: string, index: number) {
		if ($page.state[stateVariablename] === undefined) {
			return index === 0;
		}
		return tabName === tabs[$page.state[stateVariablename]].name;
	}

	onMount(async () => {
		await tick();
		if ($page.state[stateVariablename] === undefined) {
			replaceState('', { ...$page.state, [stateVariablename]: 0 });
		}
	});
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
			{#key $page.state[stateVariablename]}
				<button
					class="flex flex-row w-auto p-2 m-1 rounded-md hover:bg-yellow-300 border text-black
			{isCurrentTabSelected(tab, index) ? 'bg-yellow-300 border-black' : 'bg-white border-white'}"
					on:mouseenter={() => playAudio('hover', 0.18)}
					on:click|stopPropagation={() => {
						selectTab(tab);
					}}
					aria-label="{tab} tab"
					role="tab"
					aria-selected={isCurrentTabSelected(tab, index)}
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
						<Icon className="w-6 h-6 mr-1" src={icon} />
					{/if}
					<p>{tab}</p>
				</button>
			{/key}
		{/each}
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={(() => {
			console.log('guessTheMovieActiveTab ', $page.state[stateVariablename]);
			if ($page.state[stateVariablename] === undefined) {
				return false;
			} else {
				return tabs[$page.state[stateVariablename]].name !== tabs[0].name;
			}
		})()}
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
		class:hidden={$page.state[stateVariablename] === undefined ||
			tabs.length < 2 ||
			tabs[$page.state[stateVariablename]].name !== tabs[1].name}
		role="tabpanel"
		aria-labelledby={tab2Id}
		id={panel2Id}
	>
		<slot name="tab2" />
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={$page.state[stateVariablename] === undefined ||
			tabs.length < 3 ||
			tabs[$page.state[stateVariablename]].name !== tabs[2].name}
		role="tabpanel"
		aria-labelledby={tab3Id}
		id={panel3Id}
	>
		<slot name="tab3" />
	</div>
	<div
		class="flex-grow overflow-auto"
		class:hidden={$page.state[stateVariablename] === undefined ||
			tabs.length < 4 ||
			tabs[$page.state[stateVariablename]].name !== tabs[3].name}
		role="tabpanel"
		aria-labelledby={tab4Id}
		id={panel4Id}
	>
		<slot name="tab4" />
	</div>
</div>
