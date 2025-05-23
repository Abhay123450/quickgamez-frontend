<script lang="ts">
	import { page } from '$app/stores';
	import { API_ROUTES } from '$lib/constants/apiRoutes';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import { throttle } from '$lib/utils/throttle';
	import SelectOptions from './SelectOptions.svelte';

	const host = `http://${$page.url.hostname}:4000`;

	export let game: string;

	type TimeRange = 'Daily' | 'Weekly' | 'All-Time';

	type Ranking = {
		rank: number;
		user: {
			userId: string;
			name: string;
			username: string;
		};
		totalScore: number;
	};
	type Leaderboard = {
		game: string;
		time: TimeRange;
		rankings: Ranking[];
	};

	let rankings: Ranking[] = [];

	let timeRange: TimeRange = 'Daily';

	function handleTimeRangeChange(value: string) {
		timeRange = value as TimeRange;
		getLeaderboard(timeRange);
	}

	async function fetchLeaderboard(timeRange: TimeRange) {
		const url = new URL(API_ROUTES.LEADERBOARDS.GET_LEADERBOARD(game, timeRange.toLowerCase(), 10));
		const request: RequestInit = {};

		const [error, data] = await fetchWithTokenRefresh<Leaderboard>(url, request);
		if (error) {
			console.log(`error fetching leaderboard`, error);
			return;
		}
		rankings = data.rankings;
	}

	function saveRankingsToSession(timeRange: TimeRange) {
		const key = `leaderboard-${game}-${timeRange.toLowerCase()}`;
		const data = {
			savedOn: Date.now(),
			rankings
		};
		sessionStorage.setItem(key, JSON.stringify(data));
	}

	function getRankingsFromSession(timeRange: TimeRange) {
		const key = `leaderboard-${game}-${timeRange.toLowerCase()}`;
		const item = sessionStorage.getItem(key);
		if (!item) {
			return null;
		}
		const data = JSON.parse(item);
		if (Date.now() - data.savedOn > 1 * 60 * 1000) {
			// 1 minute
			sessionStorage.removeItem(key);
			return null;
		}
		return data.rankings;
	}

	async function getLeaderboard(timeRange: TimeRange) {
		const data = getRankingsFromSession(timeRange);
		if (data) {
			rankings = data;
			return;
		}
		await fetchLeaderboard(timeRange);
		saveRankingsToSession(timeRange);
	}
</script>

<section
	aria-labelledby="leaderboard-section"
	class="relative flex flex-col flex-1 min-h-full flex-grow-0 w-auto p-2 rounded-md items-center bg-white overflow-y-auto rounded-scrollbar"
>
	<h2 id="leaderboard-section" class="text-2xl font-bold mb-1">Leaderboards</h2>

	<SelectOptions
		options={['Daily', 'Weekly', 'All-Time']}
		onchangeHandler={throttle(handleTimeRangeChange, 600)}
	/>

	<div class="flex flex-row w-full mt-3 mb-2 items-end">
		<div class="w-1/3 pr-0.5">
			<div class="h-[152px] bg-slate-300 flex flex-col justify-center items-center rounded-sm p-1">
				{#if rankings.length > 1}
					<p class="font-bold text-2xl lg:text-3xl">#2</p>
					<p class="font-medium text-center line-clamp-2 w-full overflow-hidden break-words">
						{rankings[1].user.name}
					</p>
					<p class="text-sm text-neutral-600 -mt-1 line-clamp-2 w-full text-center break-words">
						@{rankings[1].user.username}
					</p>
					<p>Score: <b>{rankings[1].totalScore}</b></p>
				{/if}
			</div>
		</div>
		<div class="w-1/3 px-0.5">
			<div class="h-44 bg-yellow-300 flex flex-col justify-center items-center rounded-sm p-1">
				{#if rankings.length > 0}
					<p class="font-bold text-3xl lg:text-4xl">#1</p>
					<p class="font-medium text-center line-clamp-2 w-full overflow-hidden break-words">
						{rankings[0].user.name}
					</p>
					<p class="text-sm text-neutral-600 -mt-1 line-clamp-2 w-full text-center break-words">
						@{rankings[0].user.username}
					</p>
					<p>Score: <b>{rankings[0].totalScore}</b></p>
				{/if}
			</div>
		</div>
		<div class="w-1/3 pl-0.5">
			<div class="h-[128px] bg-orange-300 flex flex-col justify-center items-center rounded-sm p-1">
				{#if rankings.length > 2}
					<p class="font-bold text-xl lg:text-2xl">#3</p>
					<p class="font-medium text-center line-clamp-2 w-full overflow-hidden break-words">
						{rankings[2].user.name}
					</p>
					<p class="text-sm text-neutral-600 -mt-1 line-clamp-2 w-full text-center break-words">
						@{rankings[2].user.username}
					</p>
					<p>Score: <b>{rankings[2].totalScore}</b></p>
				{/if}
			</div>
		</div>
	</div>

	{#if rankings.length > 3}
		<div class="flex flex-row w-full bg-neutral-200 mb-1 py-1 rounded-md">
			<div class="px-2 lg:px-4 w-14 h-fit text-center font-bold flex-shrink-0">Rank</div>
			<div class="flex flex-col flex-grow px-2 lg:px-4">
				<p class="font-bold">Player</p>
			</div>
			<div class="px-2 lg:px-4 w-16 h-fit text-center font-bold flex-shrink-0">Score</div>
		</div>
	{/if}

	{#each rankings as ranking, index}
		{#if index > 2}
			<div
				class="flex flex-row w-full items-center bg-white py-2 border-b-[2px] rounded-b-md border-neutral-200"
			>
				<p class="px-2 lg:px-4 w-14 h-fit text-center font-bold text-lg flex-shrink-0">
					#{index + 1}
				</p>
				<div class="flex flex-col flex-grow px-2 lg:px-4">
					<p class="font-medium text-base">
						{ranking.user.name}
					</p>
					<p class="-mt-1 text-neutral-500 text-sm">
						@{ranking.user.username}
					</p>
				</div>
				<div class=" px-2 lg:px-4 w-16 h-fit text-center font-bold flex-shrink-0">
					{ranking.totalScore}
				</div>
			</div>
		{/if}
	{/each}
</section>

<style>
	@media (min-width: 768px) {
		/* WebKit-based browsers */
		.rounded-scrollbar::-webkit-scrollbar {
			width: 8px;
		}

		.rounded-scrollbar::-webkit-scrollbar-track {
			background: #f1f1f100;
			border-radius: 6px;
		}

		.rounded-scrollbar::-webkit-scrollbar-thumb {
			background: #afafaf;
			border-radius: 6px;
		}
	}
</style>
