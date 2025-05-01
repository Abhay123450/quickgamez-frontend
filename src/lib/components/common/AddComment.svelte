<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { addToast, isLoggedIn, isLoginPanelOpen } from '../../../routes/stores';
	import { slide } from 'svelte/transition';
	import type { Comment } from '$lib/types/Comment';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import { page } from '$app/stores';
	const dispatch = createEventDispatcher();

	export let isReply = false;
	export let replyToComment: Comment | null = null;
	export let game: string;

	let textArea: HTMLTextAreaElement;
	let newComment: string;
	let writingComment = false;
	let isProcessing: boolean = false;

	function cancel() {
		writingComment = false;
		dispatch('cancel');
	}

	function postCommentSuccess(comment: Comment) {
		console.log('comment added', JSON.stringify(comment));
		dispatch('success', comment);
	}

	async function postComment() {
		isProcessing = true;
		if (!newComment || newComment.trim().length < 1) {
			isProcessing = false;
			return;
		}
		let url: URL = new URL(`http://${$page.url.hostname}:4000/api/v1/comments`);
		const postBody: {
			comment: string;
			game: string;
			replyToCommentId?: string;
			parentCommentId?: string;
		} = { comment: newComment, game: game };
		if (replyToComment) {
			postBody.replyToCommentId = replyToComment.commentId;
			postBody.parentCommentId = replyToComment.parentCommentId || replyToComment.commentId;
			url = new URL(`http://${$page.url.hostname}:4000/api/v1/comments/reply`);
		}
		console.info(`posting comment ${JSON.stringify(postBody)}`);
		const [error, response] = await fetchWithTokenRefresh<Comment>(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(postBody)
		});

		if (error) {
			isProcessing = false;
			console.error(`error posting comment ${JSON.stringify(error)}`);
			return addToast(error.error, 'error', 6000);
		}

		console.info(`comment posted ${JSON.stringify(response)}`);
		addToast('Comment posted!', 'success', 6000);
		postCommentSuccess(response);
		cancel();
		isProcessing = false;
	}

	onMount(() => {
		if (textArea) {
			textArea.focus();
			textArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});
</script>

<div
	class=" flex flex-col w-full h-fit pt-2 rounded-md"
	in:slide={{ duration: 400 }}
	out:slide={{ duration: 400 }}
>
	<form
		class=" flex flex-col self-center w-full max-w-3xl rounded-md shadow-neutral-300 border bg-white border-gray-400"
		on:submit={postComment}
	>
		{#if isReply}
			<p class="w-full px-2 py-1">Reply to @{replyToComment?.user.username}</p>
		{/if}
		<textarea
			bind:this={textArea}
			bind:value={newComment}
			rows="5"
			class="w-full px-2 py-1 rounded-md focus:outline bg-white"
			placeholder="Write a comment..."
		/>
		<div class="flex flex-row w-fit self-end">
			<button type="button" class="w-fit px-4 py-1 rounded-md m-1 bg-gray-200" on:click={cancel}
				>Cancel</button
			>
			{#if $isLoggedIn}
				<button
					class="w-fit px-4 py-1 bg-yellow-300 rounded-md m-1"
					class:bg-neutral-200={isProcessing}
					disabled={isProcessing}
					on:click={postComment}
					type="submit">Submit</button
				>
			{:else}
				<button
					class="w-fit px-4 py-1 bg-yellow-300 rounded-md m-1"
					on:click={() => ($isLoginPanelOpen = true)}
					type="button">Login to comment</button
				>
			{/if}
		</div>
	</form>
</div>
