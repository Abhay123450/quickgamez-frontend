<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Tab from '../Tab.svelte';
	import { addToast, isLoggedIn, isLoginPanelOpen, loginActiveTab } from '../../../routes/stores';
	import { trapFocus } from '$lib/actions';
	import { Icon } from 'svelte-icons-pack';
	import { CgClose } from 'svelte-icons-pack/cg';
	import { IoArrowBackOutline } from 'svelte-icons-pack/io';
	import { OiVerified16 } from 'svelte-icons-pack/oi';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import InputText from '../common/InputText.svelte';
	import InputEmail from '../common/InputEmail.svelte';
	import InputPassword from '../common/InputPassword.svelte';
	import ButtonWithLoading from '../common/ButtonWithLoading.svelte';
	import ButtonResendOtp from '../common/ButtonResendOtp.svelte';
	import { fetchRequest } from '$lib/utils/fetchRequest';

	const host = `http://${$page.url.hostname}:4000`;
	const CREATE_USER_ROUTE = '/api/v1/users';
	const VERIFY_EMAIL_ROUTE = `/api/v1/users/auth/verify-email`;
	const SEND_EMAIL_OTP_ROUTE = `/api/v1/users/auth/send-email-otp`;
	const LOGIN_ROUTE = `/api/v1/users/auth/login`;
	const FORGOT_PASSWORD_ROUTE = `/api/v1/users/auth/forgot-password`;
	const RESET_PASSWORD_ROUTE = `/api/v1/users/auth/reset-password`;

	let registerForm: HTMLFormElement;
	let loginForm: HTMLFormElement;

	let registerName: string;
	let registerEmail: string;
	let registerPassword: string;
	let registerOtp: string;
	let loginEmail: string;
	let loginPassword: string;
	let forgotPasswordEmail: string;
	let forgotPasswordOtp: string;
	let newPassword: string;

	let registerNameError = '';
	let registerEmailError = '';
	let registerPasswordError = '';
	let registerOtpError = '';
	let loginEmailError = '';
	let loginPasswordError = '';
	let forgotPasswordEmailError = '';
	let forgotPasswordOtpError = '';
	let newPasswordError = '';

	let registerStage1Error = '';
	let registerStage2Error = '';
	let loginError = '';
	let forgotPasswordError = '';
	let verifyEmailError = '';
	let resetPasswordError = '';

	let loginWindowMessage = '';

	let isRegisterDataValid = false;
	let isLoginDataValid = false;
	let isForgotPasswordDataValid = false;
	let isVerifyEmailDataValid = false;
	let isResetPasswordDataValid = false;

	$: isRegisterDataValid =
		!(registerEmailError || registerPasswordError || registerNameError) &&
		!!registerEmail &&
		!!registerPassword &&
		!!registerName;
	$: isLoginDataValid = !(loginEmailError || loginPasswordError) && !!loginEmail && !!loginPassword;
	$: isForgotPasswordDataValid = !forgotPasswordEmailError && !!forgotPasswordEmail;
	$: isVerifyEmailDataValid =
		!forgotPasswordOtpError && !!forgotPasswordOtp && !!forgotPasswordEmail;
	$: isResetPasswordDataValid = !newPasswordError && !!newPassword;

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
		LOGIN_SUCCESSFULL
	}

	let isProcessing: boolean = false;
	let isRegistrationSuccessfull = false;
	let isForgotPassword = false;

	let registerStage: RegisterStage = RegisterStage.ENTER_DETAILS;
	let loginStage: LoginStage = LoginStage.ENTER_DETAILS;

	let tabs = ['SIGN UP', 'LOG IN'];
	let activeTab = tabs[$loginActiveTab];

	function closeLoginWindow() {
		$isLoginPanelOpen = false;
	}

	function selectTab(tab: string) {
		activeTab = tab;
	}

	async function createUser() {
		try {
			isProcessing = true;
			registerStage1Error = '';

			const user = { email: registerEmail, password: registerPassword, name: registerName };
			console.log('creating user');

			const url = `${host}${CREATE_USER_ROUTE}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});

			if (!response) {
				console.log('an error occurred');
				registerStage1Error = 'An error occurred';
				isProcessing = false;
				return;
			}

			const data = await response.json();
			console.log(`create user res data ${JSON.stringify(data)}`);

			const success: boolean = data.success;

			if (!success) {
				console.log('an error occurred');
				registerStage1Error = data.message;
				isProcessing = false;
				return;
			}

			// ON SUCCESS
			isProcessing = false;
			registerStage = RegisterStage.ENTER_OTP;
		} catch (error) {
			console.log(`failed to create user: ${error}`);
			registerStage1Error = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	async function verifyOtp() {
		console.log('verifying otp');

		try {
			isProcessing = true;
			registerStage2Error = '';

			const data = {
				email: registerEmail,
				otp: registerOtp
			};

			const url = `${host}${VERIFY_EMAIL_ROUTE}`;
			const responseData = await fetchRequest('POST', url, data);

			const success: boolean = responseData.success;
			if (!success) {
				console.log('an error occurred');
				registerStage2Error = responseData.message;
				isProcessing = false;
				return;
			}

			// ON SUCCESS
			isProcessing = false;
			registrationCompleted();
		} catch (error) {
			console.log(`failed to verify otp: ${error}`);
			registerStage2Error = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	async function sendOtp(email: string) {
		console.log('resending otp');

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
			console.log('an error occurred');
			registerStage2Error = responseData.message;
			return;
		}

		// ON SUCCESS
	}

	async function login() {
		console.log('logging in');
		isProcessing = true;

		try {
			const payload = { email: loginEmail, password: loginPassword };
			const url = `${host}${LOGIN_ROUTE}`;
			console.log(`url ${url}`);
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
				console.log('an error occurred');
				loginError = responseData.message;
				const errorCode = responseData.errorCode;
				handleLoginError(errorCode);
				isProcessing = false;
				return;
			}

			// ON SUCCESS
			loginSuccessFull();
		} catch (error) {
			console.log(`failed to login: ${error}`);
			loginError = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	function handleLoginError(errorCode: string) {
		switch (errorCode) {
			case 'USER_NOT_FOUND':
				activeTab = tabs[0];
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
			console.log(`an error occurred: ${JSON.stringify(responseData)}`);
			forgotPasswordError = responseData.message + ' ' + responseData.errors;
			return;
		}

		// ON SUCCESS
		isProcessing = false;
		loginStage = LoginStage.RESET_PASSWORD;
	}

	async function verifyEmail() {
		console.log('verifying email');

		try {
			isProcessing = true;
			registerStage2Error = '';

			const data = {
				email: forgotPasswordEmail,
				otp: forgotPasswordOtp
			};

			// const response = await fetch(
			// 	`http://${$page.url.hostname}:4000/api/v1/users/auth/verify-email`,
			// 	{
			// 		method: 'POST',
			// 		headers: {
			// 			'Content-Type': 'application/json'
			// 		},
			// 		body: JSON.stringify(data)
			// 	}
			// );

			// if (!response) {
			// 	registerStage2Error = 'An error occurred';
			// 	isProcessing = false;
			// 	return;
			// }

			// const responseData = await response.json();

			const responseData = await fetchRequest('POST', VERIFY_EMAIL_ROUTE, data);

			const success: boolean = responseData.success;
			if (!success) {
				console.log('an error occurred');
				loginError = responseData.message;
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
			console.log(`failed to verify otp: ${error}`);
			loginError = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	async function resetPassword() {
		console.log('reset password');

		try {
			isProcessing = true;
			loginError = '';

			const data = {
				email: forgotPasswordEmail,
				otp: forgotPasswordOtp,
				password: newPassword
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
			console.log(`failed to reset password: ${error}`);
			loginError = `An error occurred: ${error}`;
			isProcessing = false;
		}
	}

	function createUsername() {
		console.log('creating username');
	}

	function loginSuccessFull() {
		loginStage = LoginStage.LOGIN_SUCCESSFULL;
		addToast('Login successful', 'success', 10000);
		$isLoggedIn = true;
		setTimeout(() => {
			$isLoginPanelOpen = false;
			$loginActiveTab = 0;
		}, 3000);
		// await getUserInfo();
	}

	function registrationCompleted() {
		registerStage = RegisterStage.REGISTRATION_SUCCESSFULL;
		setTimeout(() => {
			$loginActiveTab = 1;
			activeTab = tabs[$loginActiveTab];
			loginStage = LoginStage.ENTER_DETAILS;
		}, 3000);
	}

	onMount(() => {
		console.log('mounted');
		console.log(`registerStage: ${registerStage}`);
		console.log(`loginActiveTab: ${$loginActiveTab}`);
		activeTab = tabs[$loginActiveTab];
	});
	// $: validateEmail(email.email);
	// $: validatePassword(password.password);
	// $: validateUsername(username.username);
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
	<Tab bind:activeTab {tabs} showIcon={false}>
		<!-- Register -->
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
						<InputText name="Name" bind:text={registerName} bind:errorMessage={registerNameError} />
						<InputEmail bind:email={registerEmail} bind:errorMessage={registerEmailError} />
						<InputPassword
							bind:password={registerPassword}
							bind:errorMessage={registerPasswordError}
						/>
						<p id="stage1-error" class="text-red-500" in:fly={{ y: -20 }}>
							{registerStage1Error}
						</p>
						<!-- <button
							class="w-full border rounded-md p-2 mt-2 bg-red-500 text-white {isDataValid
								? ''
								: 'opacity-50'}"
							disabled={!isDataValid}>SignIn</button
						> -->
						<ButtonWithLoading
							text="Sign Up"
							bind:isLoading={isProcessing}
							isDisabled={!isRegisterDataValid}
						/>
					</form>
					<div class="flex flex-row w-fit h-fit mt-3 self-center place-items-center">
						<p>Already have an account?</p>
						<button
							class="text-red-500 px-1"
							on:click={(e) => {
								$loginActiveTab = 1;
								selectTab(tabs[$loginActiveTab]);
								e.stopPropagation();
							}}>Log In</button
						>
					</div>
				{:else if registerStage === RegisterStage.ENTER_OTP}
					<p class="text-lg self-center font-medium">Verify Email</p>
					<p class="text-base self-center my-1">Enter the OTP sent to {registerEmail}</p>
					<form id="verify-otp" on:submit|preventDefault={verifyOtp}>
						<InputText name="OTP" bind:text={registerOtp} bind:errorMessage={registerOtpError} />
						<ButtonResendOtp
							on:click={() => {
								sendOtp(registerEmail);
							}}
						/>
						<p id="stage2-error" class="text-red-500">{registerStage2Error}</p>
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
		<!-- Login -->
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
					<form bind:this={loginForm} on:submit|preventDefault={login}>
						<InputEmail bind:email={loginEmail} bind:errorMessage={loginEmailError} />
						<InputPassword bind:password={loginPassword} bind:errorMessage={loginPasswordError} />
						<button
							on:click={() => (loginStage = LoginStage.FORGOT_PASSWORD)}
							type="button"
							class="w-fit px-2 py-1 rounded-md text-red-500 text-sm"
						>
							Forgot Password?
						</button>
						<p class="text-red-500">{loginError}</p>
						<ButtonWithLoading
							text="Log In"
							bind:isLoading={isProcessing}
							isDisabled={!isLoginDataValid}
						/>
					</form>
					<div class="flex flex-row w-fit h-fit mt-3 self-center place-items-center">
						<p>Don't have an account?</p>
						<button
							class="text-red-500 px-1"
							on:click={(e) => {
								$loginActiveTab = 0;
								selectTab(tabs[$loginActiveTab]);
								e.stopPropagation();
							}}>Create Account</button
						>
					</div>
				{:else if loginStage === LoginStage.FORGOT_PASSWORD}
					<h1 class="text-2xl self-center font-medium">Forgot Password</h1>
					<p class="text-base self-center my-1">Enter the email associated with your account</p>
					<form on:submit|preventDefault={forgotPassword}>
						<InputEmail
							bind:email={forgotPasswordEmail}
							bind:errorMessage={forgotPasswordEmailError}
						/>
						<p class="text-red-500">{forgotPasswordError}</p>
						<ButtonWithLoading
							text="Send OTP to Email"
							bind:isLoading={isProcessing}
							isDisabled={!isForgotPasswordDataValid}
						/>
					</form>
				{:else if loginStage === LoginStage.VERIFY_EMAIL}
					<h1 class="text-2xl self-center font-medium">VERIFY EMAIL</h1>
					<p class="text-base self-center my-1">Enter the OTP sent to {loginEmail}</p>
					<form on:submit|preventDefault={verifyEmail}>
						<InputText
							name="otp"
							bind:text={forgotPasswordOtp}
							bind:errorMessage={forgotPasswordOtpError}
						/>
						<ButtonResendOtp
							on:click={() => {
								sendOtp(loginEmail);
							}}
						/>
						<p class="text-red-500">{verifyEmailError}</p>
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
						<InputPassword bind:password={newPassword} bind:errorMessage={loginPasswordError} />
						<p class="text-red-500">{resetPasswordError}</p>
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
	<!-- </div> -->
</div>
