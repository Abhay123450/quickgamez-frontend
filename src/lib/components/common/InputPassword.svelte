<script lang="ts">
	import { page } from '$app/stores';
	import { Icon } from 'svelte-icons-pack';
	import { TrOutlineCheck } from 'svelte-icons-pack/tr';
	import { RiSystemErrorWarningLine } from 'svelte-icons-pack/ri';
	import { AiFillEye, AiFillEyeInvisible } from 'svelte-icons-pack/ai';
	import LoadingSpin from './LoadingSpin.svelte';
	import { debounce } from '$lib/utils/debounce';

	export let password: string = '';
	export let errorMessage = '';

	let isPasswordVisible = false;

	async function validatePassword() {
		if (!password || password.trim().length < 6) {
			errorMessage = 'Password must be at least 6 characters';
			return;
		}
		errorMessage = '';
	}

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}
</script>

<div class="relative flex flex-col mt-2">
	{#if isPasswordVisible}
		<input
			name="password"
			bind:value={password}
			on:input={validatePassword}
			type="text"
			class="w-full px-4 py-2 border border-gray-500 rounded shadow-sm"
			placeholder="Password"
			aria-label="Enter password"
			aria-required="true"
			aria-invalid={errorMessage !== ''}
			aria-errormessage={errorMessage}
			spellcheck="false"
		/>
		<p class="text-red-500 text-sm ps-1 h-5">{errorMessage}</p>
		<button class="flex absolute right-2 top-2 text-gray-600" on:click={togglePasswordVisibility}>
			<Icon src={AiFillEye} className="w-6 h-6" />
		</button>
	{:else}
		<input
			name="password"
			bind:value={password}
			on:input={validatePassword}
			type="password"
			class="w-full px-4 py-2 border border-gray-500 rounded shadow-sm"
			placeholder="Password"
			aria-label="Enter password"
			aria-required="true"
			aria-invalid={errorMessage !== ''}
			aria-errormessage={errorMessage}
			spellcheck="false"
		/>
		<p class="text-red-500 text-sm ps-1 h-5">{errorMessage}</p>
		<button class="flex absolute right-2 top-2 text-gray-600" on:click={togglePasswordVisibility}>
			<Icon src={AiFillEyeInvisible} className="w-6 h-6" />
		</button>
	{/if}
</div>

<style>
	input[type='password']::-ms-reveal,
	input[type='password']::-ms-clear {
		display: none;
	}
</style>
