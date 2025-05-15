<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Tab from '../tabs/Tab.svelte';
	import type { Tab as TabType } from '../tabs/Tabs';
	import { addToast, isLoggedIn, loginActiveTab, userDetails } from '../../../routes/stores';
	import { trapFocus } from '$lib/actions';
	import { Icon } from 'svelte-icons-pack';
	import { CgClose } from 'svelte-icons-pack/cg';
	import { IoArrowBackOutline } from 'svelte-icons-pack/io';
	import { OiVerified16 } from 'svelte-icons-pack/oi';
	import { page } from '$app/stores';
	import InputPassword from '../common/input/InputPassword.svelte';
	import ButtonWithLoading from '../common/ButtonWithLoading.svelte';
	import ButtonResendOtp from '../common/ButtonResendOtp.svelte';
	import { fetchRequest } from '$lib/utils/fetchRequest';
	import { replaceState } from '$app/navigation';
	import InputText from '../common/input/InputText.svelte';
	import { isEmailValid, isNotEmpty } from '$lib/utils/inputValidation';

	const host = `http://${$page.url.hostname}:4000`;
	const CREATE_USER_ROUTE = '/api/v1/users';
	const VERIFY_EMAIL_ROUTE = `/api/v1/users/auth/verify-email`;
	const SEND_EMAIL_OTP_ROUTE = `/api/v1/users/auth/send-email-otp`;
	const LOGIN_ROUTE = `/api/v1/users/auth/login`;
	const FORGOT_PASSWORD_ROUTE = `/api/v1/users/auth/forgot-password`;
	const RESET_PASSWORD_ROUTE = `/api/v1/users/auth/reset-password`;

	let registerForm: HTMLFormElement;
	let loginForm: HTMLFormElement;

	// RegisterStage.ENTER_DETAILS
	let registerName: string;
	let registerEmail: string;
	let registerPassword: string;
	// RegisterStage.ENTER_OTP
	let registerOtp: string;
	// LoginStage.ENTER_DETAILS
	let loginEmail: string;
	let loginPassword: string;
	// LoginStage.FORGOT_PASSWORD
	let forgotPasswordEmail: string;
	// LoginStage.VERIFY_EMAIL
	let forgotPasswordOtp: string;
	// LoginStage.RESET_PASSWORD;
	let newPassword: string;

	let registerDataValid = {
		registerName: false,
		registerEmail: false,
		registerPassword: false
	};
	let isRegisterOtpValid = false;

	let loginDatValid = {
		loginEmail: false,
		loginPassword: false
	};

	let isForgotPasswordEmailValid = false;
	let isForgotPasswordOtpValid = false;
	let isNewPasswordValid = false;

	let registerStage1Error = '';
	let registerStage2Error = '';
	let loginError = '';
	let forgotPasswordError = '';
	let verifyEmailError = '';
	let resetPasswordError = '';

	let isRegisterDataValid = false;
	let isLoginDataValid = false;
	let isVerifyEmailDataValid = false;
	let isResetPasswordDataValid = false;

	$: isRegisterDataValid = Object.values(registerDataValid).every((value) => value);
	$: isLoginDataValid = Object.values(loginDatValid).every((value) => value);
	$: isVerifyEmailDataValid = isForgotPasswordEmailValid && isForgotPasswordOtpValid;
	$: isResetPasswordDataValid =
		isNewPasswordValid && isForgotPasswordEmailValid && isForgotPasswordOtpValid;

	enum RegisterStage {
		ENTER_DETAILS,
		ENTER_OTP,
		REGISTRATION_SUCCESSFULL
	}
	enum LoginStage {
		ENTER_DETAILS,
		FORGOT_PASSWORD,
		VERIFY_EMAIL,
		RESET_PASSWORD,
		LOGIN_SUCCESSFULL,
		EMAIL_VERIFIED
	}

	let isProcessing: boolean = false;
	let isRegistrationSuccessfull = false;
	let isForgotPassword = false;

	let registerStage: RegisterStage = RegisterStage.ENTER_DETAILS;
	let loginStage: LoginStage = LoginStage.ENTER_DETAILS;

	let tabs: TabType[] = [{ name: 'SIGN UP' }, { name: 'LOG IN' }];
	let activeTab: string = tabs[$loginActiveTab].name;

	function closeLoginWindow() {
		history.back();
	}

	function selectTab(tab: string) {
		replaceState('', { ...$page.state, loginActiveTab: tabs.findIndex((t) => t.name === tab) });
	}

	async function createUser() {
		try {
			isProcessing = true;
			registerStage1Error = '';

			if (!isRegisterDataValid) {
				registerStage1Error = 'Please fill in all the required fields';
				isProcessing = false;
				return;
			}

			const user = { email: registerEmail, password: registerPassword, name: registerName };

			const url = `${host}${CREATE_USER_ROUTE}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});

			if (!response) {
				registerStage1Error = 'An error occurred';
				isProcessing = false;
				return;
			}

			const data = await response.json();

			const success: boolean = data.success;

			if (!success) {
				registerStage1Error = data.message;
				isProcessing = false;
				return;
			}

			// ON SUCCESS
			isProcessing = false;
			registerStage = RegisterStage.ENTER_OTP;
		} catch (error) {
			registerStage1Error = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	async function verifyOtp() {
		try {
			isProcessing = true;
			registerStage2Error = '';

			if (!isVerifyEmailDataValid) {
				registerStage2Error = 'Please fill in all the required fields';
				isProcessing = false;
				return;
			}

			const data = {
				email: registerEmail,
				otp: registerOtp
			};

			const url = `${host}${VERIFY_EMAIL_ROUTE}`;
			const responseData = await fetchRequest('POST', url, data);

			const success: boolean = responseData.success;
			if (!success) {
				registerStage2Error = responseData.message;
				isProcessing = false;
				return;
			}

			// ON SUCCESS
			isProcessing = false;
			registrationCompleted();
		} catch (error) {
			registerStage2Error = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	async function sendOtp(email: string) {
		const payload = { email };
		const url = `${host}${SEND_EMAIL_OTP_ROUTE}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!response) {
			registerStage2Error = 'An error occurred';
			return;
		}

		const responseData = await response.json();
		const success: boolean = responseData.success;
		if (!success) {
			registerStage2Error = responseData.message;
			return;
		}

		// ON SUCCESS
	}

	async function login() {
		isProcessing = true;

		if (!isLoginDataValid) {
			loginError = 'Please fill in all the required fields';
			isProcessing = false;
			return;
		}

		try {
			const payload = { email: loginEmail, password: loginPassword };
			const url = `${host}${LOGIN_ROUTE}`;
			alert(url);
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload),
				credentials: 'include'
			});

			if (!response) {
				loginError = 'An error occurred';
				isProcessing = false;
				return;
			}

			const responseData = await response.json();
			const success: boolean = responseData.success;

			if (!success) {
				loginError = responseData.message;
				const errorCode = responseData.errorCode;
				handleLoginError(errorCode);
				isProcessing = false;
				return;
			}

			if (responseData.user) {
				$userDetails = responseData.user;
			}

			// ON SUCCESS
			loginSuccessFull();
		} catch (error) {
			loginError = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	function handleLoginError(errorCode: string) {
		switch (errorCode) {
			case 'USER_NOT_FOUND':
				activeTab = tabs[0].name;
				registerEmail = loginEmail;
				registerPassword = loginPassword;
				registerStage = RegisterStage.ENTER_DETAILS;
				break;
			case 'EMAIL_NOT_VERIFIED':
				loginStage = LoginStage.VERIFY_EMAIL;
				sendOtp(loginEmail);
				break;
		}
	}

	async function forgotPassword() {
		isProcessing = true;

		if (!isForgotPasswordEmailValid) {
			forgotPasswordError = 'Please fill in all the required fields';
			isProcessing = false;
			return;
		}

		const url = `${host}${FORGOT_PASSWORD_ROUTE}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: forgotPasswordEmail })
		});

		if (!response) {
			forgotPasswordError = 'An error occurred';
			isProcessing = false;
			return;
		}

		const responseData = await response.json();

		const success: boolean = responseData.success;
		if (!success) {
			forgotPasswordError = responseData.message;
			isProcessing = false;
			return;
		}

		// ON SUCCESS
		isProcessing = false;
		isForgotPassword = true;
		loginStage = LoginStage.VERIFY_EMAIL;
	}

	async function verifyEmail() {
		try {
			isProcessing = true;
			registerStage2Error = '';

			if (!isForgotPasswordOtpValid) {
				registerStage2Error = 'Please fill in all the required fields';
				isProcessing = false;
				return;
			}

			const data = {
				email: forgotPasswordEmail,
				otp: forgotPasswordOtp
			};

			const url = `${host}${VERIFY_EMAIL_ROUTE}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			const responseData = await response.json();

			const success: boolean = responseData.success;
			if (!success) {
				verifyEmailError = responseData.message;
				isProcessing = false;
				return;
			}

			// ON SUCCESS

			if (isForgotPassword) {
				isProcessing = false;
				loginStage = LoginStage.RESET_PASSWORD;
			} else {
				loginStage = LoginStage.LOGIN_SUCCESSFULL;
				login();
			}
		} catch (error) {
			loginError = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	async function resetPassword() {
		try {
			isProcessing = true;
			loginError = '';

			if (!isResetPasswordDataValid) {
				loginError = 'Please fill in all the required fields';
				isProcessing = false;
				return;
			}

			const data = {
				email: forgotPasswordEmail,
				otp: forgotPasswordOtp,
				newPassword: newPassword
			};

			const url = `${host}${RESET_PASSWORD_ROUTE}`;

			const responseData = await fetchRequest('POST', url, data);

			if (!responseData) {
				loginError = 'An error occurred';
				isProcessing = false;
				return;
			}

			if (!responseData.success) {
				loginError = responseData.message;
				isProcessing = false;
				return;
			}

			// ON SUCCESS
			isProcessing = false;
			loginStage = LoginStage.ENTER_DETAILS;
			addToast('Password reset successful', 'success', 7000);
		} catch (error) {
			loginError = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	function loginSuccessFull() {
		loginStage = LoginStage.LOGIN_SUCCESSFULL;
		addToast('Login successful', 'success', 10000);
		$isLoggedIn = true;
		setTimeout(() => {
			if ($page.state.isLoginPanelOpen === true) {
				history.back();
			}
		}, 3000);
		// await getUserInfo();
	}

	function registrationCompleted() {
		registerStage = RegisterStage.REGISTRATION_SUCCESSFULL;
		setTimeout(() => {
			$loginActiveTab = 1;
			selectTab(tabs[$loginActiveTab].name);
			loginStage = LoginStage.ENTER_DETAILS;
		}, 3000);
	}
</script>

<div
	use:trapFocus
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 300 }}
	class="absolute top-0 left-0 flex flex-row justify-around items-center w-full h-dvh min-h-dvh max-h-dvh bg-black bg-opacity-50 z-40 cursor-pointer"
	role="button"
	tabindex="0"
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			if (
				registerStage === RegisterStage.ENTER_DETAILS ||
				registerStage === RegisterStage.REGISTRATION_SUCCESSFULL ||
				loginStage === LoginStage.ENTER_DETAILS ||
				loginStage === LoginStage.LOGIN_SUCCESSFULL
			) {
				closeLoginWindow();
			}
		}
	}}
>
	<Tab bind:activeTab {tabs} showIcon={false} context="logintab">
		<!-- REGISTER -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			slot="tab1"
			class="flex flex-row w-auto h-auto items-center justify-center cursor-auto"
			on:click={(e) => e.stopPropagation()}
		>
			<div
				class="relative flex flex-col bg-white w-full max-w-lg h-fit justify-evenly rounded rouned-md mx-2 p-4"
			>
				<h1 class="text-2xl self-center font-medium mb-4" aria-label="Create account">
					Create account
				</h1>

				<button
					class="absolute top-2 right-2"
					on:click={closeLoginWindow}
					disabled={isProcessing}
					hidden={registerStage !== RegisterStage.ENTER_DETAILS &&
						registerStage !== RegisterStage.REGISTRATION_SUCCESSFULL}
					aria-label="Close"
				>
					<Icon className="w-6 h-6" src={CgClose} />
				</button>

				{#if registerStage === RegisterStage.ENTER_DETAILS}
					<form
						bind:this={registerForm}
						id="create-user"
						on:submit|preventDefault={createUser}
						class="flex flex-col"
					>
						<div class="flex flex-col space-y-4">
							<InputText
								name="Name"
								autocomplete="name"
								bind:value={registerName}
								validationErrorHandler={() => (registerDataValid.registerName = false)}
								validationSuccessHandler={() => (registerDataValid.registerName = true)}
							/>
							<InputText
								name="Email"
								autocomplete="email"
								bind:value={registerEmail}
								validationErrorHandler={() => (registerDataValid.registerEmail = false)}
								validationSuccessHandler={() => (registerDataValid.registerEmail = true)}
							/>
							<InputPassword
								name="Password"
								autocomplete="new-password"
								bind:value={registerPassword}
								validationErrorHandler={() => (registerDataValid.registerPassword = false)}
								validationSuccessHandler={() => (registerDataValid.registerPassword = true)}
							/>
						</div>

						<p id="stage1-error" class="text-red-600" in:fly={{ y: -20 }}>
							{registerStage1Error}
						</p>
						<p class="text-xs self-center mt-2">
							By signing up, you agree to our
							<a href="/terms-of-use" class="text-blue-600 underline" target="_blank"
								>Terms of Use</a
							>
							and
							<a href="/privacy-policy" class="text-blue-600 underline" target="_blank"
								>Privacy Policy</a
							>
						</p>
						<ButtonWithLoading
							text="Sign Up"
							bind:isLoading={isProcessing}
							isDisabled={!isRegisterDataValid}
						/>
					</form>
					<div class="flex flex-row w-fit h-fit mt-3 self-center place-items-center">
						<p>Already have an account?</p>
						<button
							class="text-red-600 px-1"
							on:click={(e) => {
								$loginActiveTab = 1;
								selectTab(tabs[$loginActiveTab].name);
								e.stopPropagation();
							}}>Log In</button
						>
					</div>
				{:else if registerStage === RegisterStage.ENTER_OTP}
					<p class="text-lg self-center font-medium">Verify Email</p>
					<p class="text-base self-center my-1">Enter the OTP sent to {registerEmail}</p>
					<form class="pt-4" id="verify-otp" on:submit|preventDefault={verifyOtp}>
						<InputText
							name="OTP"
							autocomplete="one-time-code"
							bind:value={registerOtp}
							validationFunction={isNotEmpty}
							validationErrorHandler={() => (isRegisterOtpValid = false)}
							validationSuccessHandler={() => (isRegisterOtpValid = true)}
						/>
						<ButtonResendOtp
							on:click={() => {
								sendOtp(registerEmail);
							}}
						/>
						<p id="stage2-error" class="text-red-600">{registerStage2Error}</p>
						<ButtonWithLoading text="Verify" bind:isLoading={isProcessing} />
					</form>
				{:else if registerStage === RegisterStage.REGISTRATION_SUCCESSFULL}
					<div class=" text-green-500 self-center font-medium">
						<Icon className="w-32 h-32" src={OiVerified16} />
					</div>
					<p class="self-center font-medium my-2">Registration Successfull</p>
				{/if}
			</div>
		</div>
		<!-- LOGIN -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="flex flex-row w-auto h-auto items-center justify-center cursor-auto"
			on:click={(e) => e.stopPropagation()}
			slot="tab2"
		>
			<div class="flex flex-col relative bg-white w-full max-w-lg h-fit rounded rouned-md mx-2 p-4">
				{#if loginStage === LoginStage.ENTER_DETAILS || loginStage === LoginStage.LOGIN_SUCCESSFULL}
					<button class="absolute top-2 right-2" on:click={closeLoginWindow}>
						<Icon className="w-6 h-6" src={CgClose} />
					</button>
				{:else if loginStage === LoginStage.FORGOT_PASSWORD}
					<button
						class="self-start"
						on:click={() => {
							loginStage = LoginStage.ENTER_DETAILS;
						}}
					>
						<Icon className="w-6 h-6" src={IoArrowBackOutline} />
					</button>
				{/if}
				{#if loginStage === LoginStage.ENTER_DETAILS}
					<h1 class="text-2xl self-center font-medium">LOGIN</h1>
					<div class="flex flex-row w-fit h-fit my-2 self-center place-items-center">
						{#if isRegistrationSuccessfull}
							<p class="px-2 py-1 bg-green-100 text-green-800 rounded-md border border-green-800">
								Registration Successful. Login to continue.
							</p>
						{/if}
					</div>
					<form bind:this={loginForm} on:submit|preventDefault={login} class="flex flex-col">
						<InputText
							bind:value={loginEmail}
							name="Email"
							autocomplete="username"
							placeholder="Enter Your Email"
							validationFunction={isEmailValid}
							validationErrorHandler={() => (loginDatValid.loginEmail = false)}
							validationSuccessHandler={() => (loginDatValid.loginEmail = true)}
							className="mt-4"
						/>
						<InputPassword
							bind:value={loginPassword}
							name="Password"
							autocomplete="current-password"
							placeholder="Enter Your Password"
							validationErrorHandler={() => (loginDatValid.loginPassword = false)}
							validationSuccessHandler={() => (loginDatValid.loginPassword = true)}
							className="mt-6"
						/>
						<button
							on:click={() => (loginStage = LoginStage.FORGOT_PASSWORD)}
							type="button"
							class="w-fit px-1 py-1 rounded-md text-red-600 text-sm my-2 hover:underline hover:underline-offset-2 hover:decoration-red-600"
						>
							Forgot Password?
						</button>
						<p class="text-red-600">{loginError}</p>
						<ButtonWithLoading
							text="Log In"
							bind:isLoading={isProcessing}
							isDisabled={!isLoginDataValid}
						/>
					</form>
					<div class="flex flex-row w-fit h-fit mt-3 self-center place-items-center">
						<p>Don't have an account?</p>
						<button
							class="text-red-600 px-1"
							on:click={(e) => {
								$loginActiveTab = 0;
								selectTab(tabs[$loginActiveTab].name);
								e.stopPropagation();
							}}>Create Account</button
						>
					</div>
				{:else if loginStage === LoginStage.FORGOT_PASSWORD}
					<h1 class="text-2xl self-center font-medium">Forgot Password</h1>
					<p class="text-base self-center my-1">Enter the email associated with your account</p>
					<form on:submit|preventDefault={forgotPassword}>
						<InputText
							bind:value={forgotPasswordEmail}
							name="Email"
							autocomplete="username"
							placeholder="Enter Your Email"
							validationFunction={isEmailValid}
							validationErrorHandler={() => (isForgotPasswordEmailValid = false)}
							validationSuccessHandler={() => (isForgotPasswordEmailValid = true)}
							className="my-4"
						/>
						<p class="text-red-600">{forgotPasswordError}</p>
						<ButtonWithLoading
							text="Send OTP to Email"
							bind:isLoading={isProcessing}
							isDisabled={!isForgotPasswordEmailValid}
						/>
					</form>
				{:else if loginStage === LoginStage.VERIFY_EMAIL}
					<h1 class="text-2xl self-center font-medium">VERIFY EMAIL</h1>
					<p class="text-base self-center my-1">Enter the OTP sent to {forgotPasswordEmail}</p>
					<form on:submit|preventDefault={verifyEmail}>
						<InputText
							bind:value={forgotPasswordOtp}
							name="OTP"
							autocomplete="one-time-code"
							placeholder="Enter Your OTP"
							validationFunction={isNotEmpty}
							validationErrorHandler={() => (isForgotPasswordOtpValid = false)}
							validationSuccessHandler={() => (isForgotPasswordOtpValid = true)}
							className="mt-4"
						/>
						<ButtonResendOtp
							on:click={() => {
								sendOtp(loginEmail);
							}}
						/>
						<p class="text-red-600">{verifyEmailError}</p>
						<ButtonWithLoading
							text="Verify"
							bind:isLoading={isProcessing}
							isDisabled={!isVerifyEmailDataValid}
						/>
					</form>
				{:else if loginStage === LoginStage.RESET_PASSWORD}
					<h1 class="text-2xl self-center font-medium">RESET PASSWORD</h1>
					<p class="text-base self-center my-1">Create a new password</p>
					<form on:submit|preventDefault={resetPassword}>
						<InputPassword
							bind:value={newPassword}
							name="Password"
							autocomplete="new-password"
							placeholder="Enter a new password"
							validationErrorHandler={() => (isNewPasswordValid = false)}
							validationSuccessHandler={() => (isNewPasswordValid = true)}
							className="mt-4"
						/>
						<p class="text-red-600">{resetPasswordError}</p>
						<ButtonWithLoading
							text="Reset Password"
							bind:isLoading={isProcessing}
							isDisabled={!isResetPasswordDataValid}
						/>
					</form>
				{:else if loginStage === LoginStage.LOGIN_SUCCESSFULL}
					<div class="text-green-500 self-center font-medium">
						<Icon className="w-32 h-32" src={OiVerified16} />
					</div>
					<p class="self-center font-medium my-2">Login Successfull</p>
				{/if}
			</div>
		</div>
	</Tab>
</div>
