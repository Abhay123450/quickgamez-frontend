<script lang="ts">
	import type { Comment } from '$lib/types/Comment';
	import CommentSingle from './CommentSingle.svelte';
	import AddComment from './AddComment.svelte';
	import Dialog from '../Dialog.svelte';
	import { getCommentsFromLocalStorage, saveCommentsToLocalStorage } from '$lib/utils/localStorage';
	import LoadingSpin from '../common/LoadingSpin.svelte';
	import SelectOptions from '../common/SelectOptions.svelte';
	import { API_ROUTES } from '$lib/constants/apiRoutes';

	export let game: string;
	export let isWritingComment: boolean = false;

	type CommentsFilterOptions = 'Newest' | 'Oldest' | 'Popular';

	let comments: Comment[] = [];

	let newComment: string;
	let commentPlaceholder: string = 'Write a comment...';

	let loginRequired: boolean = false;

	let isLoading: boolean = true;

	let filter: CommentsFilterOptions = 'Popular';
	let pageNumber = 1;
	const limit = 5;

	let allCommentsFetched = false;
	let btnLoadMoreComments: HTMLButtonElement;

	function replyToComment(e: CustomEvent<{ commentId: string; commentBy: string }>) {
		console.log(`reply to ${(e.detail.commentId, e.detail.commentBy)}`);
		isWritingComment = true;
		commentPlaceholder = `Reply to ${e.detail.commentBy}`;
		// newComment = `@${e.detail.commentBy} `;
	}

	async function fetchComments(
		game: string,
		pageNumber: number = 1,
		limit: number = 5,
		sort: CommentsFilterOptions = 'Popular'
	): Promise<Comment[] | null> {
		isLoading = true;
		let sortQuery = `sort=2`;
		switch (sort) {
			case 'Newest':
				sortQuery = `sort=0`;
				break;
			case 'Oldest':
				sortQuery = `sort=1`;
				break;
			case 'Popular':
				sortQuery = `sort=2`;
				break;
			default:
				sortQuery = `sort=2`;
				break;
		}
		const url = API_ROUTES.COMMENTS.GET_COMMENTS(game, pageNumber, limit, sortQuery);
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (!response) {
			isLoading = false;
			return null;
		}

		const data = await response.json();
		if (!data) {
			isLoading = false;
			return null;
		}
		if (!data.success) {
			isLoading = false;
			return null;
		}
		isLoading = false;
		// console.log(`comments response ${JSON.stringify(data.data)}`);
		return data.data as Comment[];
	}

	async function loadMoreComments() {
		console.log('load more comments');
		pageNumber += 1;
		let newComments: Comment[] | null = await fetchComments(game, pageNumber, limit, filter);
		if (newComments) {
			comments = [...comments, ...newComments];
			saveCommentsToLocalStorage(game, filter, comments);
			if (newComments.length === 0) {
				allCommentsFetched = true;
			}
		}
	}

	function newCommentAdded(e: CustomEvent<Comment>) {
		console.log('newCommentAdded', JSON.stringify(e.detail));
		const comment: Comment = e.detail;
		comments = [comment, ...comments];
	}

	async function getComments(
		game: string,
		filter: CommentsFilterOptions,
		page: number,
		limit: number
	) {
		isLoading = true;

		let commentsList: Comment[] | null = getCommentsFromLocalStorage(game, filter);

		console.info('commentsList', commentsList);

		if (commentsList) {
			isLoading = false;
			comments = commentsList;
			pageNumber = comments.length / limit;
			return;
		}

		commentsList = await fetchComments(game, page, limit, filter);
		if (commentsList) {
			comments = commentsList;
			pageNumber = comments.length / limit;
			saveCommentsToLocalStorage(game, filter, comments);
		}

		isLoading = false;
	}

	function handleFilterChange(e: any) {
		filter = e.detail;
		pageNumber = 1;
		getComments(game, filter, pageNumber, limit);
	}
</script>

<section
	aria-labelledby="comments-title"
	class="relative flex flex-col min-h-full h-full mt-0 w-auto p-2 rounded-md items-center bg-white overflow-y-auto rounded-scrollbar"
>
	<h2 id="comments-title" class="text-2xl font-bold mb-2">Comments</h2>
	<div class=" w-full max-w-3xl">
		<SelectOptions options={['Popular', 'Newest', 'Oldest']} on:change={handleFilterChange} />
	</div>

	{#if !isWritingComment}
		<button
			class="w-full max-w-3xl rounded-md border border-neutral-400 px-2 py-1 mt-2 text-left"
			on:click={() => (isWritingComment = true)}
		>
			Write a comment...
		</button>
	{:else}
		<AddComment {game} on:cancel={() => (isWritingComment = false)} on:success={newCommentAdded} />
	{/if}

	<div class="flex flex-col w-full max-w-3xl">
		{#if comments.length === 0}
			<p class="w-full px-2 py-1">No Comments. Be the first to comment!</p>
		{:else}
			{#each comments as comment}
				<CommentSingle {comment} {game} on:replyTo={replyToComment} />
			{/each}
		{/if}
	</div>
	{#if comments.length > 0 && comments.length % limit === 0 && !allCommentsFetched}
		{#if isLoading}
			<LoadingSpin />
		{:else}
			<button
				bind:this={btnLoadMoreComments}
				class="w-fit rounded-md border border-gray-400 px-2 py-1 mt-2 mb-12 text-left"
				on:click={loadMoreComments}
			>
				Load more comments
			</button>
		{/if}
	{:else}
		<div class="flex flex-row h-fit w-fit mt-2 mb-12">
			<div
				class=" h-2 w-24 bg-yellow-300 rounded-full border border-solid border-neutral-500"
			></div>
			<div
				class=" h-2 w-2 mx-2 bg-yellow-300 rounded-full border border-solid border-neutral-500"
			></div>
			<div
				class=" h-2 w-24 bg-yellow-300 rounded-full border border-solid border-neutral-500"
			></div>
		</div>
	{/if}
</section>

{#if loginRequired}
	<Dialog
		message="You must be logged in to comment"
		callbackFunctionPositive={() => (loginRequired = false)}
	/>
{/if}

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
