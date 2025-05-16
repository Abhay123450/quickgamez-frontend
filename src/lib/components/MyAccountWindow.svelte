<script lang="ts">
	import { CgSpinner } from 'svelte-icons-pack/cg';
	import { TrOutlineLogout } from 'svelte-icons-pack/tr';
	import {
		addToast,
		isLoggedIn,
		isLoginPanelOpen,
		loginActiveTab,
		userDetails
	} from '../../routes/stores';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import { page } from '$app/stores';
	import { type User } from '$lib/types/User';
	import { onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { pushState } from '$app/navigation';
	import UserAvatar from './common/UserAvatar.svelte';
	import { API_ROUTES } from '$lib/constants/apiRoutes';

	let confirmLogout = false;
	let isProcessing = true;

	function openLogin() {
		$isLoginPanelOpen = true;
		$loginActiveTab = 1;
		pushState('', { ...$page.state, isLoginPanelOpen: true, loginActiveTab: 1 });
	}

	function openSignup() {
		$isLoginPanelOpen = true;
		$loginActiveTab = 0;
		pushState('', { ...$page.state, isLoginPanelOpen: true, loginActiveTab: 0 });
	}

	export async function getUserInfo(): Promise<User | null> {
		isProcessing = true;
		if ($userDetails) {
			isProcessing = false;
			console.info(`user details found ${JSON.stringify($userDetails)}`);
			return $userDetails;
		}
		const req: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};
		const url = new URL(API_ROUTES.USER.GET_MY_PROFILE);
		const [error, data] = await fetchWithTokenRefresh<User>(url, req);

		if (error) {
			if (error.errorCode === 'TOKEN_EXPIRED' || error.errorCode === 'LOGIN_REQUIRED') {
				$isLoggedIn = false;
			}
			$isLoggedIn = false;
			console.error(`error my account ${JSON.stringify(error)}`);
			isProcessing = false;
			return null;
		} else if (data) {
			console.info(`user details fetched ${JSON.stringify($userDetails)}`);
			$isLoginPanelOpen = false;
			$isLoggedIn = true;
			$userDetails = data;
			isProcessing = false;
			return data;
		}
		isProcessing = false;
		$isLoggedIn = false;
		return null;
	}

	async function logout() {
		console.info('logging out');
		const req: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};
		const url = new URL(API_ROUTES.USER.AUTH.LOGOUT);
		const response = await fetch(url, req);
		const data: any = await response.json();

		if (data) {
			$isLoginPanelOpen = false;
			$isLoggedIn = false;
			$userDetails = null;
			addToast(data.message, 'success', 3000);
			confirmLogout = false;
		}
	}

	// $: $isLoggedIn,
	// 	async () => {
	// 		user = await getUserInfo();
	// 	};

	onMount(() => {
		getUserInfo();
	});
</script>

<div class="relative flex flex-col w-full h-auto p-1 bg-white rounded-b overflow-y-auto">
	{#if $userDetails}
		<div class="flex flex-row w-full h-fit ps-1 mb-1">
			<div class="flex flex-col w-fit h-fit self-center">
				<UserAvatar avatarUrl={$userDetails.avatar} className="w-12 h-12" />
			</div>
			<div class="flex flex-col w-full h-fit ps-2">
				<!-- user details -->
				<p class="text-lg font-semibold line-clamp-1">
					{$userDetails.name}
				</p>

				<p class="text-base font-normal line-clamp-1">@{$userDetails.username}</p>
			</div>
		</div>

		<a
			href="/users/profile/me"
			class="w-full h-fit px-4 py-1 my-1 rounded-md border border-red-600 font-medium text-center text-red-600 hover:bg-red-600 hover:text-white"
			>View Profile & Settings</a
		>

		{#if confirmLogout}
			<div class="flex flex-col w-fit h-fit self-end px-2 py-1 rounded-md border border-red-600">
				<p class="w-fit pb-1">Are you sure you want to logout?</p>
				<span class="self-end">
					<button
						on:click={logout}
						class="w-fit h-fit px-4 py-1 rounded-md bg-red-600 text-white font-medium">Yes</button
					>
					<button
						on:click={() => (confirmLogout = false)}
						class="w-fit h-fit px-4 py-1 rounded-md bg-red-600 text-white font-medium">No</button
					>
				</span>
			</div>
		{:else}
			<button
				on:click={() => (confirmLogout = true)}
				class="flex flex-row w-fit h-fit pl-4 pr-3 py-1 self-end space-x-1 rounded-md bg-red-600 text-white font-medium"
			>
				<p>Logout</p>
				<Icon src={TrOutlineLogout} className="w-6 h-6 self-center " title="Logout" />
			</button>
		{/if}
	{:else}
		<!-- login prompt -->
		<p class="mb-1">Login to save your progress, post comments, climb leaderboards and more.</p>
		<button
			class="w-full h-fit px-4 py-0.5 rounded-md bg-red-600 text-white text-lg self-center"
			on:click={openLogin}>Login</button
		>
		<p class="w-fit self-center">OR</p>
		<button
			class="w-full h-fit px-4 py-0.5 rounded-md bg-red-600 text-white text-lg self-center"
			on:click={openSignup}>Create Account</button
		>
	{/if}
	<div
		class="absolute flex flex-col w-fit h-auto top-0 left-1/2 -translate-x-1/2 overflow-hidden bg-white rounded-full"
		class:hidden={!isProcessing}
	>
		<Icon src={CgSpinner} className="w-9 h-9 animate-spin self-center" />
	</div>
</div>
