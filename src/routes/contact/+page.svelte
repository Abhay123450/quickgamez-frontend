<script>
	import Footer from '$lib/components/common/Footer.svelte';
	import InputText from '$lib/components/common/input/InputText.svelte';
	import InputTextArea from '$lib/components/common/input/InputTextArea.svelte';
	import TopNav from '$lib/components/common/TopNav.svelte';
	import { API_ROUTES } from '$lib/constants/apiRoutes';
	import { isEmailValid, isNotEmpty } from '$lib/utils/inputValidation';
	import { addToast } from '../stores';

	let name = '';
	let email = '';
	let subject = '';
	let message = '';

	let isDataValid = false;

	$: isDataValid = email !== '' && name !== '' && subject !== '' && message !== '';

	async function handleSubmit() {
		if (!isDataValid) {
			addToast('Please fill out all the fields', 'warning', 5000);
			return;
		}

		const url = new URL(API_ROUTES.CONTACT_US);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				email,
				subject,
				message
			})
		});

		if (response.ok) {
			addToast('Message sent successfully.', 'success', 5000);
			name = '';
			email = '';
			subject = '';
			message = '';
		} else {
			addToast('An error occurred.', 'error', 5000);
		}
	}
</script>

<div class="flex flex-col overflow-auto min-h-dvh max-h-dvh">
	<header class="flex sticky top-0 z-10">
		<TopNav />
	</header>
	<div class="flex flex-col p-2 w-full max-w-xl self-center grow">
		<h1 class="text-2xl font-medium self-center underline underline-offset-4">Contact Us</h1>
		<p class="text-center my-4">
			Send us an email at <a
				class=" underline underline-offset-[5px] hover:decoration-red-700 hover:text-red-700"
				href="mailto:contact@quickgamez.com">contact@quickgamez.com</a
			>
		</p>

		<p class="text-center text-xl font-bold text-neutral-600">OR</p>

		<p>Fill out the form below:</p>

		<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-5 mt-4">
			<InputText
				bind:value={name}
				name="Name"
				placeholder="Enter Your Name"
				validationFunction={isNotEmpty}
			/>
			<InputText
				bind:value={email}
				name="Email"
				placeholder="Enter Your Email"
				validationFunction={isEmailValid}
			/>
			<InputText bind:value={subject} name="Subject" validationFunction={isNotEmpty} />
			<InputTextArea bind:value={message} name="Message" validationFunction={isNotEmpty} />

			<button
				disabled={!isDataValid}
				type="submit"
				class="w-fit px-4 py-2 self-end rounded-md {isDataValid
					? 'bg-red-600'
					: 'bg-neutral-600'} text-white">Send Message</button
			>
		</form>
	</div>
	<Footer />
</div>
