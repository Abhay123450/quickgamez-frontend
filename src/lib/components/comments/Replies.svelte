<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import CommentSingle from './CommentSingle.svelte';
	import type { Comment } from '$lib/types/Comment';
	import LoadingSpin from '../common/LoadingSpin.svelte';
	import { getRepliesFromLocalStorage, saveRepliesToLocalStorage } from '$lib/utils/localStorage';

	export let commentId: string = '';
	export let numberOfReplies: number = 6;
	export let game: string;
	export let newReplyAdded: Comment | null = null;

	let isLoading = false;

	let replies: Comment[] = [];
	const limit = 2;
	let pageNumber: number = 1;

	let container: HTMLDivElement;

	$: if (newReplyAdded) {
		console.info('new reply added', JSON.stringify(newReplyAdded));
		numberOfReplies++;
		replies = [...replies, newReplyAdded];
		newReplyAdded = null;
	}

	async function fetchReplies(commentId: string): Promise<Comment[]> {
		isLoading = true;
		const url = `http://${$page.url.hostname}:4000/api/v1/comments/${commentId}/replies?page=${pageNumber}&limit=${limit}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		if (!response.status || response.status === 400) {
			isLoading = false;
			return [];
		}
		const data = await response.json();
		console.log(`reply response ${JSON.stringify(response)}`);
		console.log(`reply data ${JSON.stringify(data)}`);
		if (!data) {
			isLoading = false;
			return [];
		}
		isLoading = false;
		pageNumber++;
		return data.data as Comment[];
	}

	async function loadReplies() {
		replies = [...replies, ...(await fetchReplies(commentId))];
		saveRepliesToLocalStorage(commentId, replies);
		await tick();
		const newRepliesFirst = container.querySelectorAll('article')[
			(pageNumber - 2) * limit
		] as HTMLElement;
		const focusable = newRepliesFirst.querySelector<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		focusable?.focus();
	}

	onMount(async () => {
		console.info('replies', replies);
		replies = getRepliesFromLocalStorage(commentId) || [];
	});

	function showNewReply(e: CustomEvent<Comment>) {
		const reply = e.detail;
		console.info('new reply', JSON.stringify(reply));
		numberOfReplies++;
		replies = [...replies, reply];
	}
</script>

<div bind:this={container} class="flex flex-col w-full h-full max-w-3xl">
	{#each replies as reply, i}
		<div class="flex flex-row w-full h-fit">
			<div class="relative flex flex-row flex-shrink-0 basis-[5%] w-full min-h-full justify-center">
				<!-- <div class="absolute flex w-[1px] h-full bg-neutral-500"></div> -->
				<div
					class:hidden={numberOfReplies <= replies.length && i === replies.length - 1}
					class="absolute flex bg-transparent w-1/2 translate-x-1/2 self-center h-full top-0 border border-neutral-300 border-l border-b-0 border-t-0 border-r-0"
				></div>
				<div
					class="absolute flex bg-transparent w-1/2 translate-x-1/2 self-center h-1/4 top-0 border border-neutral-300 border-l border-b border-t-0 border-r-0 rounded-bl-3xl"
				></div>
			</div>
			<div class="flex flex-col basis-[95%] max-w-[95%] h-full">
				<CommentSingle comment={reply} {game} on:newReply={showNewReply} />
			</div>
		</div>
	{/each}
</div>
<div class="flex flex-row w-full h-fit" class:hidden={numberOfReplies <= replies.length}>
	<div class="relative flex flex-row basis-[5%] w-full min-h-full justify-center">
		<div
			class="absolute flex bg-transparent w-1/2 translate-x-1/2 self-center h-1/2 top-0 border border-neutral-300 border-l border-b border-t-0 border-r-0 rounded-bl-3xl"
		></div>
	</div>
	<div class="flex flex-col basis-[95%] w-full h-full mb-2">
		<button
			disabled={isLoading}
			class="line underline w-fit font-medium text-blue-600 text-base mt-2 ps-1"
			on:click={loadReplies}
		>
			{#if isLoading}
				<LoadingSpin />
			{:else}View {numberOfReplies - replies.length} replies
			{/if}
		</button>
	</div>
</div>
