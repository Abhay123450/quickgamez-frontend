<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import {
		BiLike,
		BiDislike,
		BiSolidLike,
		BiSolidDislike,
		BiDotsVerticalRounded
	} from 'svelte-icons-pack/bi';
	import { BsFlag, BsReply } from 'svelte-icons-pack/bs';
	import { IoClose, IoTrashOutline } from 'svelte-icons-pack/io';
	import type { Comment } from '$lib/types/Comment';
	import { createEventDispatcher } from 'svelte';
	import Replies from './Replies.svelte';
	import AddComment from './AddComment.svelte';
	import { page } from '$app/stores';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import { addToast, isLoggedIn, userDetails } from '../../../routes/stores';
	import Dialog from '../Dialog.svelte';
	import { pushState, replaceState } from '$app/navigation';
	import { fade, fly, slide } from 'svelte/transition';
	import UserAvatar from '../common/UserAvatar.svelte';

	const dispatchNewReply = createEventDispatcher<{ newReply: Comment }>();

	export let comment: Comment;
	export let game: string;

	console.log('comment', comment);

	let commentParagraph: HTMLParagraphElement;
	let maxCommentLengthWhenCollapsed: number = 160; // number of chars

	let isExpanded: boolean = !shouldCollapseComment(comment.text);

	let showReplyForm: boolean = false;
	let showMenu: boolean = false;
	let showDeleteDialog: boolean = false;

	let reportReasons = [
		'Spam or Misleading',
		'Hateful or Abusive',
		'Copyright Infringement',
		'Sexual Content',
		'Harassment'
	];

	let reportReason: string | null = null;

	let newReply: Comment | null = null;

	async function reactOnComment(
		commentId: string,
		reaction: 'like' | 'dislike' | 'unlike' | 'undislike'
	) {
		console.info(`isLoggedIn ${$isLoggedIn}`);
		let method: 'POST' | 'DELETE' = 'POST';
		let url: URL = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/${commentId}/like`);
		switch (reaction) {
			case 'like':
				method = 'POST';
				url = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/${commentId}/like`);
				break;
			case 'dislike':
				method = 'POST';
				url = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/${commentId}/dislike`);
				break;
			case 'unlike':
				method = 'DELETE';
				url = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/${commentId}/like`);
				break;
			case 'undislike':
				method = 'DELETE';
				url = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/${commentId}/dislike`);
				break;
		}

		const [error, response] = await fetchWithTokenRefresh(url, {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		// const response = await fetch(url, {
		// 	method,
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	credentials: 'include'
		// });

		console.info(`reaction response error ${JSON.stringify(error)}`);
		console.info(`reaction response data ${JSON.stringify(response)}`);
	}

	function replyToComment() {
		showReplyForm = true;
		// return;
		// let replyTo = {
		// 	commentId: comment.commentId,
		// 	commentBy: comment.user.username
		// };
		// dispatch('replyTo', replyTo);
	}

	function numberToString(num: number): string {
		if (num < 1000) {
			return num.toString();
		}
		if (num < 10000) {
			return (num / 1000).toFixed(1) + ' K';
		}
		if (num < 1000000) {
			return (num / 1000).toFixed(0) + ' K';
		}
		if (num < 1000000000) {
			return (num / 1000000).toFixed(1) + ' M';
		}

		return (num / 1000000000).toFixed(1) + ' B';
	}

	function shouldCollapseComment(text: string): boolean {
		if (!text) return false;
		let newLineCount = 0;
		for (let i = 0; i < text.length; i++) {
			const element = text[i];
			if (element === '\n') {
				newLineCount++;
				if (newLineCount > 2) {
					return true;
				}
			}
		}
		return text.length > maxCommentLengthWhenCollapsed;
	}

	function dateToString(date: Date): string {
		let currentDate = Date.now();
		let diff = (currentDate - date.getTime()) / 1000;

		if (diff < 60) {
			return 'Just now';
		}
		if (diff < 3600) {
			return Math.floor(diff / 60) + ' minutes ago';
		}
		if (diff < 86400) {
			return Math.floor(diff / 3600) + ' hours ago';
		}
		if (diff < 604800) {
			return Math.floor(diff / 86400) + ' days ago';
		}
		if (diff < 2592000) {
			return Math.floor(diff / 604800) + ' weeks ago';
		}
		if (diff < 31536000) {
			return Math.floor(diff / 2592000) + ' months ago';
		}
		return Math.floor(diff / 31536000) + ' years ago';
	}

	function toDatetimeString(dateInput: Date | string | number): string {
		const date = new Date(dateInput);
		if (isNaN(date.getTime())) {
			throw new Error('Invalid date input');
		}

		const pad = (n: number) => String(n).padStart(2, '0');

		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1); // Months are zero-based
		const day = pad(date.getDate());
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function newReplyAdded(e: CustomEvent<Comment>) {
		const comment = e.detail;
		console.log('new reply added event recieved', JSON.stringify(comment));
		// if (comment.replyToComment?.commentId === comment.commentId) {
		// 	newReply = comment;
		// 	return;
		// }
		newReply = comment;
		dispatchNewReply('newReply', comment);
	}

	async function deleteComment() {
		const url = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/${comment.commentId}`);
		const [error, response] = await fetchWithTokenRefresh(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		console.info(`delete comment response error ${JSON.stringify(error)}`);
		console.info(`delete comment response data ${JSON.stringify(response)}`);
		if (error) {
			addToast('Error deleting comment', 'error', 3000);
			return;
		}
		addToast('Comment deleted', 'success', 3000);
	}

	async function reportComment() {
		const url = new URL(
			`http://${$page.url.hostname}:4000/api/v1/comments/${comment.commentId}/report`
		);
		const [error, response] = await fetchWithTokenRefresh(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({ reason: reportReason })
		});
		console.info(`report comment response error ${JSON.stringify(error)}`);
		console.info(`report comment response data ${JSON.stringify(response)}`);
		if (error) {
			if (error.errorCode === 'LOGIN_REQUIRED') {
				addToast('You need to be logged in to report a comment.', 'error', 5000);
				return;
			}
			addToast('Error reporting comment', 'error', 3000);
			return;
		}
		addToast('Comment reported.', 'success', 3000);
	}
</script>

<article
	class="relative flex flex-col w-full min-w-full max-w-3xl p-2 mt-2 rounded-md border border-neutral-300"
>
	<header class="flex space-x-2 w-full h-fit">
		<!-- <picture
			class=" flex items-end justify-center w-10 h-10 border border-neutral-300 rounded-full overflow-clip bg-yellow-200"
		>
			<img class="w-11/12 h-11/12" src="/avatars/{comment.user.avatar || '1.svg'}" alt="avatar" />
		</picture> -->
		<UserAvatar avatarUrl={comment.user.avatar} className="w-10 h-10" />
		<div class="flex flex-col">
			<p class="font-semibold text-base">
				{comment.user.name}
				{comment.user.userId === $userDetails?.userId ? '(You)' : ''}
			</p>

			<div class="flex flex-row text-center">
				<p class="text-neutral-600 leading-4 text-sm">@{comment.user.username}</p>
				<p class="text-neutral-600 leading-4 mx-1">•</p>
				<time
					datetime={toDatetimeString(new Date(comment.createdAt))}
					class="text-neutral-600 leading-4 text-sm"
					>{dateToString(new Date(comment.createdAt))}</time
				>
			</div>
		</div>
	</header>

	<p
		bind:this={commentParagraph}
		class="relative text-neutral-900 w-full leading-6 mt-1 flex-wrap break-words {isExpanded
			? 'whitespace-pre-wrap'
			: 'whitespace-normal '}"
	>
		{#if comment.replyToComment}<span class="text-black bg-neutral-200 rounded-md px-1 me-1"
				>@{comment.replyToComment?.user.username}</span
			>{/if}{isExpanded
			? comment.text
			: comment.text.substring(0, maxCommentLengthWhenCollapsed) + '...'}
	</p>
	<button
		on:click={() => (isExpanded = !isExpanded)}
		class="w-fit pb-1 rounded-md underline underline-offset-2 font-medium text-neutral-600 hover:text-black"
		class:hidden={!shouldCollapseComment(comment.text)}
		>{isExpanded ? 'Show less' : 'Read more'}
	</button>
	<footer class="flex flex-row">
		<button
			class=" flex flex-row p-1 items-center rounded-full hover:bg-neutral-200 {comment.myReaction ===
			'like'
				? 'text-red-600'
				: 'text-neutral-600'}"
			class:text-blue-600={comment.myReaction === 'like'}
			on:click={async () => {
				if (!$isLoggedIn) {
					pushState('', { ...$page.state, requireLogin: true });
					return;
				}
				const myReaction = comment.myReaction;
				// comment.dislikeCount += myReaction === 'dislike' ? -1 : 0;
				if (myReaction === 'like') {
					if (comment.likeCount > 0) comment.likeCount -= 1;
					comment.myReaction = null;
					await reactOnComment(comment.commentId, 'unlike');
				} else if (myReaction === 'dislike') {
					if (comment.dislikeCount > 0) comment.dislikeCount -= 1;
					comment.likeCount += 1;
					comment.myReaction = 'like';
					await reactOnComment(comment.commentId, 'like');
				} else {
					comment.likeCount += 1;
					comment.myReaction = 'like';
					await reactOnComment(comment.commentId, 'like');
				}
			}}
		>
			<Icon className="w-5 h-5" src={comment.myReaction === 'like' ? BiSolidLike : BiLike} />
		</button>
		<p class=" py-1 mr-2 text-neutral-600">{numberToString(comment.likeCount)}</p>
		<button
			class=" flex flex-row text-neutral-600 p-1 items-center rounded-full hover:bg-neutral-200"
			on:click={async () => {
				if (!$isLoggedIn) {
					pushState('', { ...$page.state, requireLogin: true });
					return;
				}
				const myReaction = comment.myReaction;
				if (myReaction === 'dislike') {
					if (comment.dislikeCount > 0) comment.dislikeCount -= 1;
					comment.myReaction = null;
					await reactOnComment(comment.commentId, 'undislike');
				} else if (myReaction === 'like') {
					if (comment.likeCount > 0) comment.likeCount -= 1;
					comment.dislikeCount += 1;
					comment.myReaction = 'dislike';
					await reactOnComment(comment.commentId, 'dislike');
				} else {
					comment.dislikeCount += 1;
					comment.myReaction = 'dislike';
					await reactOnComment(comment.commentId, 'dislike');
				}
			}}
		>
			<Icon
				className="w-5 h-5"
				src={comment.myReaction === 'dislike' ? BiSolidDislike : BiDislike}
			/>
		</button>
		<p class="py-1 text-neutral-600">{numberToString(comment.dislikeCount)}</p>
		<p class="mx-2 py-1 text-neutral-600">•</p>
		<button
			class=" flex flex-row items-center px-1 rounded-md text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
			on:click={replyToComment}
		>
			<Icon className="w-5 h-5" src={BsReply} />
			<p>Reply</p>
		</button>
		{#if $isLoggedIn && comment.user.userId.length > 0}
			<button
				on:click={() => (showMenu = !showMenu)}
				class="absolute right-2 top-2 hover:bg-neutral-200 rounded-md text-neutral-600 p-1"
				><Icon src={BiDotsVerticalRounded} className="w-5 h-5" /></button
			>
			{#key showMenu}
				<ul
					class:hidden={!showMenu}
					transition:slide={{ axis: 'x', duration: 300 }}
					class="absolute w-fit flex flex-col right-9 top-2 border bg-white rounded-md text-neutral-700"
				>
					{#if comment.user.userId === $userDetails?.userId}
						<li>
							<button
								on:click={() => pushState('', { showDeleteCommentDialog: true })}
								type="button"
								class="px-4 py-1 flex rounded hover:bg-neutral-200 items-center gap-2 shadow"
								><Icon src={IoTrashOutline} className="w-4 h-4" />Delete</button
							>
						</li>
					{:else}
						<li>
							<button
								on:click={() => pushState('', { showCommentReportDialog: true })}
								type="button"
								class="px-4 py-1 rounded hover:bg-neutral-200 flex items-center gap-2 shadow"
								><Icon src={BsFlag} className="w-3.5 h-3.5" />Report</button
							>
						</li>
					{/if}
				</ul>
			{/key}
		{/if}
	</footer>
</article>

{#if showReplyForm}
	<AddComment
		isReply={true}
		replyToComment={comment}
		{game}
		on:cancel={() => (showReplyForm = false)}
		on:success={newReplyAdded}
	/>
{/if}

{#if comment.replyCount > 0}
	<Replies
		{game}
		commentId={comment.commentId}
		numberOfReplies={comment.replyCount}
		newReplyAdded={newReply}
	/>
{/if}

{#if $page.state.showDeleteCommentDialog}
	<Dialog
		title="Delete Comment"
		message="Are you sure you want to delete this comment?"
		btnTextPositive="Delete"
		isCancellable={true}
		callbackFunctionPositive={deleteComment}
		callbackFunctionNegative={() => (showDeleteDialog = false)}
	/>
{/if}

{#if $page.state.showCommentReportDialog}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog
		transition:fade={{ duration: 300 }}
		open
		class="fixed top-0 left-0 w-full h-full flex justify-center items-center p-4 bg-black bg-opacity-20 z-50"
		aria-modal="true"
		on:click={() => history.back()}
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			on:click|stopPropagation
			in:fly={{ y: 50, duration: 300 }}
			out:fly={{ y: 50, duration: 300 }}
			class="relative flex flex-col w-full max-w-md bg-white rounded-lg p-6 shadow-lg"
		>
			<header class="flex justify-between items-center mb-4">
				<h2 id="dialog-title" class="text-xl font-semibold">Report Comment</h2>
				<button
					type="button"
					class="hover:bg-gray-200 rounded-full p-1 text-gray-600"
					aria-label="Close"
					on:click={() => history.back()}
				>
					<Icon src={IoClose} className="w-6 h-6" />
				</button>
			</header>

			<form
				class="space-y-3"
				on:submit|preventDefault={() => {
					reportComment();
					history.back();
				}}
			>
				<fieldset class="space-y-2">
					<legend class="sr-only">Select a reason to report</legend>
					{#each reportReasons as reason, index}
						<div class="flex items-center space-x-2">
							<input
								id={`reason-${index}`}
								type="radio"
								name="reportType"
								bind:group={reportReason}
								value={reason}
								required
								class="accent-red-600"
							/>
							<label for={`reason-${index}`} class="text-gray-700">{reason}</label>
						</div>
					{/each}
				</fieldset>

				<div class="mt-6 flex justify-center">
					<button
						type="submit"
						disabled={!reportReason}
						class="px-5 py-2 rounded-md text-white text-lg font-medium transition-colors
		  {reportReason ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}"
					>
						Report
					</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

{#if $page.state.requireLogin}
	<Dialog
		title="Login Required"
		message="You must be logged in to react on this comment"
		btnTextPositive="Login"
		btnTextNegative="Cancel"
		callbackFunctionPositive={() => {
			replaceState('', { ...$page.state, requireLogin: false, isLoginPanelOpen: true });
		}}
	/>
{/if}
