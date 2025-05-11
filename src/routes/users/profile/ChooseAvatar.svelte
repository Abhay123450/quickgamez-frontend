<script lang="ts">
	import { page } from '$app/stores';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import { onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { IoClose } from 'svelte-icons-pack/io';
	import { fade, fly } from 'svelte/transition';
	import { addToast, userDetails } from '../../stores';

	let avatars: string[] = [];
	let selectedAvatar: string | null = null;
	const avatarCount = 10; // Change this if you have more/less avatars

	onMount(() => {
		avatars = Array.from({ length: avatarCount }, (_, i) => `${i + 1}.svg`);
	});

	function selectAvatar(avatar: string) {
		selectedAvatar = avatar;
	}

	async function saveAvatar() {
		if (!selectedAvatar) {
			addToast('Please select an avatar', 'warning', 3000);
			return;
		}
		if (!$userDetails) {
			addToast('User details not found', 'error', 3000);
			return;
		}
		console.log(`selected avatar ${selectedAvatar}`);
		const url = new URL(`http://${$page.url.hostname}:4000/api/v1/users/${$userDetails?.userId}`);
		const [error, response] = await fetchWithTokenRefresh(url, {
			body: JSON.stringify({ avatar: selectedAvatar }),
			method: 'PUT'
		});
		if (error) {
			addToast('Error updating avatar', 'error', 3000);
			return;
		}
		addToast('Avatar updated', 'success', 3000);
		$userDetails.avatar = selectedAvatar;
		history.back();
	}

	function getAvatarBg(avatar: string) {
		const num = avatar.split('.')[0];
		switch (num) {
			case '1':
				return 'bg-blue-500';
			case '2':
				return 'bg-yellow-200';
			case '3':
				return 'bg-yellow-200';
			case '4':
				return 'bg-yellow-200';
			case '5':
				return 'bg-neutral-700';
			case '6':
				return 'bg-blue-500';
			case '7':
				return 'bg-yellow-200';
			case '8':
				return 'bg-yellow-200';
			case '9':
				return 'bg-emerald-600';
			case '10':
				return 'bg-yellow-200';
		}
	}
</script>

<dialog
	transition:fade={{ duration: 300 }}
	id="choose-avatar-modal"
	open
	aria-label="Choose avatar modal"
	class="absolute left-0 top-0 bg-black bg-opacity-50 rounded-md shadow-2xl p-2 w-full h-fit flex flex-col items-center space-y-6 z-40"
>
	<div
		transition:fly={{ y: 50, duration: 300 }}
		class="flex flex-col bg-white w-full max-w-lg h-fit justify-evenly rounded rouned-md mx-2 p-4"
	>
		<h2 class="text-2xl font-bold mb-4">Choose Your Avatar</h2>

		<div class="w-full h-full grid grid-cols-3 gap-4 overflow-auto p-1">
			{#each avatars as avatar}
				<button
					type="button"
					aria-pressed={selectedAvatar === avatar}
					aria-label="Select avatar"
					on:click={() => selectAvatar(avatar)}
					class={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition flex justify-center items-center
					${selectedAvatar === avatar ? 'border-red-600 ring-2 ring-red-300' : 'border-gray-300'} ${getAvatarBg(
						avatar
					)}`}
				>
					<img src={`/avatars/${avatar}`} alt="User avatar" class="w-20 h-20 object-contain" />
				</button>
			{/each}
		</div>

		<div class="flex justify-end space-x-2">
			<button
				class="mt-6 bg-neutral-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-neutral-700 transition disabled:opacity-50 w-full"
				on:click={() => {
					selectedAvatar = null;
					history.back();
				}}
			>
				Cancel
			</button>

			<button
				class="mt-6 bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 w-full"
				on:click={saveAvatar}
				disabled={!selectedAvatar}
			>
				Save Avatar
			</button>
		</div>
	</div>
</dialog>
