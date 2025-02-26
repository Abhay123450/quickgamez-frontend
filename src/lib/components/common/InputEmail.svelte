<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemErrorWarningLine } from 'svelte-icons-pack/ri';

	export let email: string = '';
	export let errorMessage: string = '';

	function validateEmail() {
		if (!isValidEmail(email)) {
			errorMessage = 'Invalid email';
		} else {
			errorMessage = '';
		}
	}

	function isValidEmail(email: string) {
		let re = /\S+@\S+\.\S+/;
		return re.test(email);
	}
</script>

<div class="relative flex flex-col mt-2">
	<input
		name="email"
		type="email"
		bind:value={email}
		on:input={validateEmail}
		class="w-full px-4 py-2 border border-gray-500 rounded shadow-sm"
		placeholder="Email Id"
		aria-label="Enter email"
		aria-required="true"
		aria-invalid={errorMessage !== ''}
		aria-errormessage={errorMessage}
		spellcheck="false"
	/>

	<p class="text-red-500 text-sm ps-1 h-5">{errorMessage}</p>

	{#if errorMessage !== ''}
		<div class="flex absolute right-2 top-2 text-red-500">
			<Icon src={RiSystemErrorWarningLine} className="w-6 h-6" />
		</div>
	{/if}
</div>
