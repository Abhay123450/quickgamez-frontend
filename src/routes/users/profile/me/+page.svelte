<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import { addToast, isLoggedIn, userDetails as userDetailsStore } from '../../../stores';
	import { fetchWithTokenRefresh } from '$lib/utils/fetchRequest';
	import TopNav from '$lib/components/common/TopNav.svelte';
	import TextEditable from '../TextEditable.svelte';
	import ButtonWithLoading from '$lib/components/common/ButtonWithLoading.svelte';
	import type { User } from '$lib/types/User';
	import ChooseAvatar from '../ChooseAvatar.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { BiEdit } from 'svelte-icons-pack/bi';
	import type { ValidationResult } from '$lib/types/ValidationResult';
	import { API_ROUTES } from '$lib/constants/apiRoutes';

	const url: URL = new URL(API_ROUTES.USER.GET_MY_PROFILE);
	let updatedUserDetails: Partial<User> = {};
	let errorMessage = 'Loading...';

	let isSavingUserData = false;

	let isUserNameValid = true;
	let isUsernameValid = true;

	onMount(async () => {
		const [error, data] = await getMyProfile();
		if (error) {
			errorMessage = error.error;
			if (error.errorCode === 'LOGIN_REQUIRED') {
				$isLoggedIn = false;
				pushState('', { ...$page.state, isLoginPanelOpen: true, loginActiveTab: 1 });
				// refreshOnLogin();
			}
		} else if (data) {
			$userDetailsStore = data as User;
			errorMessage = '';
		}
		console.log(`on mount data ${JSON.stringify(data)}`);
		console.error(`on mount error ${JSON.stringify(error)}`);
		console.info(`cookies ${document.cookie}`);
	});

	async function getMyProfile() {
		const request: RequestInit = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};

		return await fetchWithTokenRefresh<User>(url, request);
	}

	function validateUserName(name: string): ValidationResult {
		if (name.length < 3) {
			return { isValid: false, errorMessage: 'Name must be at least 3 characters long' };
		}
		return { isValid: true, errorMessage: '' };
	}

	async function verifyUsername(newUsername: string): Promise<ValidationResult> {
		if (!newUsername || newUsername.trim() === '') {
			return {
				isValid: false,
				errorMessage: 'Username cannot be empty'
			};
		}
		if (!$userDetailsStore?.username) {
			return {
				isValid: false,
				errorMessage: 'An error occurred. Username is empty'
			};
		}
		if ($userDetailsStore.username === newUsername) {
			return {
				isValid: true,
				errorMessage: '',
				validationMessage: ''
			};
		}
		const isValid = validateUsername(newUsername);
		if (typeof isValid === 'string') {
			return {
				isValid: false,
				errorMessage: isValid
			};
		}
		console.log(newUsername);

		const isAvailable = await checkUsername(newUsername);

		if (typeof isAvailable === 'string') {
			return {
				isValid: false,
				errorMessage: isAvailable
			};
		}

		if (isAvailable) {
			return {
				isValid: true,
				errorMessage: '',
				validationMessage: 'Username available ✅'
			};
		} else {
			return {
				isValid: false,
				errorMessage: 'Username already taken'
			};
		}
	}

	function validateUsername(username: string) {
		if (username.length > 20) {
			return "Username can't be longer than 20 characters";
		}
		const re = /^[a-zA-Z0-9_]+$/i;
		const isValid = re.test(username);
		if (!isValid) {
			return "Username can only contain letters, numbers, and underscore '_'";
		}
		return true;
	}

	async function checkUsername(newUsername: string): Promise<boolean | string> {
		const result = await fetch(new URL(API_ROUTES.USER.CHECK_USERNAME_AVAILABILITY(newUsername)));
		const data = await result.json();
		if (!data) {
			return false;
		}
		if (!data.success && data.errorCode === 'VALIDATION_ERROR') {
			return data.errors.toString();
		}
		console.log(data);
		return data.data.isAvailable;
	}

	async function updateUserData() {
		isSavingUserData = true;
		if (!$userDetailsStore?.userId) {
			return;
		}
		const req: RequestInit = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedUserDetails),
			credentials: 'include'
		};
		const url = new URL(API_ROUTES.USER.UPDATE_USER_DATA($userDetailsStore.userId));

		const [error, data] = await fetchWithTokenRefresh(url, req);

		if (error) {
			if (error.errorCode === 'TOKEN_EXPIRED' || error.errorCode === 'LOGIN_REQUIRED') {
				$isLoggedIn = false;
			} else if (error.errorCode === 'VALIDATION_ERROR') {
			}
			console.error(`error update user data ${JSON.stringify(error)}`);
			isSavingUserData = false;
			addToast(error.error, 'error');
			return;
		}

		console.log(`data update user data ${JSON.stringify(data)}`);
		isSavingUserData = false;
		if (!$userDetailsStore) {
			return;
		}
		if (updatedUserDetails.username) {
			$userDetailsStore.username = updatedUserDetails.username;
			// updatedUserDetails = updatedUserDetails;
		}
		if (updatedUserDetails.name) {
			$userDetailsStore.name = updatedUserDetails.name;
		}
		addToast('Changes saved successfully', 'success');
		return;
	}

	function isUserDataChanged(userDetails: Partial<User> | null, updatedUserDetails: Partial<User>) {
		console.log('updatedUserDetails', updatedUserDetails);
		console.log('userDetails', userDetails);
		if (userDetails === null) {
			return false;
		}
		let result = false;

		// Type-safe way to iterate through object keys
		(Object.keys(updatedUserDetails) as Array<keyof typeof updatedUserDetails>).forEach((key) => {
			if (updatedUserDetails[key] !== userDetails[key]) {
				result = true;
			}
		});
		console.log('isUserDataChanged', result);
		return result;
	}
</script>

<div class="flex flex-col h-full max-h-full overflow-y-auto">
	<TopNav isShowImage={false} title="My Profile" />
	<div class="relative flex flex-col w-full max-w-3xl self-center p-2">
		{#if !$isLoggedIn}
			<p class="border border-black px-2 py-1 text-lg">{errorMessage}</p>
		{:else}
			<h2 class="text-xl font-bold mb-2">User Details</h2>
			<div class="flex flex-col w-full h-fit">
				<div class="relative flex w-fit mb-4 p-2 self-center">
					<picture
						class="w-24 h-24 md:w-28 md:h-28 border border-neutral-400 rounded-full overflow-clip bg-yellow-200"
					>
						<img
							class:hidden={!$userDetailsStore?.avatar}
							class="w-full h-full"
							src={`/avatars/${$userDetailsStore?.avatar || '1.svg'}`}
							alt="avatar"
						/>
					</picture>
					<button
						type="button"
						aria-label="Change avatar"
						class="absolute top-2 right-2 bg-white rounded-full p-1 border border-neutral-400"
						on:click={() => pushState('', { ...$page.state, showAvatarSelectionDialog: true })}
					>
						<Icon src={BiEdit} className="w-4 h-4" />
					</button>
				</div>
				{#if $page.state.showAvatarSelectionDialog}
					<ChooseAvatar />
				{/if}
				<form on:submit|preventDefault={updateUserData}>
					<div class="flex flex-col space-y-6">
						<TextEditable
							label="Name"
							value={$userDetailsStore?.name}
							name="name"
							validationFunction={validateUserName}
							validationErrorHandler={() => (isUserNameValid = false)}
							validationSuccessHandler={(value) => {
								isUserNameValid = true;
								updatedUserDetails = { ...updatedUserDetails, name: value };
							}}
						/>
						<TextEditable
							label="Username"
							value={$userDetailsStore?.username}
							name="username"
							validationFunction={verifyUsername}
							validationErrorHandler={() => (isUsernameValid = false)}
							validationSuccessHandler={(value) => {
								isUsernameValid = true;
								updatedUserDetails = { ...updatedUserDetails, username: value };
							}}
						/>
						<div class="flex place-self-end max-w-24">
							<ButtonWithLoading
								text="Update"
								isDisabled={!isUserNameValid ||
									!isUsernameValid ||
									!isUserDataChanged($userDetailsStore, updatedUserDetails)}
								isLoading={isSavingUserData}
							/>
						</div>
					</div>
				</form>
			</div>

			<h2 class="text-xl font-bold my-4">Account Details</h2>
			<div class="flex flex-col space-y-6">
				<TextEditable label="Email" value={$userDetailsStore?.email} isEditable={false} />
			</div>
		{/if}
	</div>
</div>
