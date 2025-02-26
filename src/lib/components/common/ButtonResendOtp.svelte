<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	let shouldResendOtp: boolean = true;
	let resendOtpTimeout: number = 60;

	let interval: number;

	function startCountdown() {
		resendOtpTimeout = 60;
		interval = setInterval(() => {
			if (resendOtpTimeout > 1) {
				resendOtpTimeout--;
			} else {
				clearInterval(interval);
				shouldResendOtp = true;
				resendOtpTimeout = 60;
			}
		}, 1000);
	}

	function buttonClicked() {
		shouldResendOtp = false;
		startCountdown();
		dispatch('click');
	}

	onMount(() => {
		startCountdown();
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

{#if shouldResendOtp}
	<button
		on:click|preventDefault|stopPropagation={buttonClicked}
		type="button"
		class="text-sm bg-white hover:bg-red-200 text-red-500 font-medium py-1 px-2 mt-2 border border-red-500 rounded-md"
	>
		Resend OTP
	</button>
{:else}
	<p class="text-sm py-1 px-2">Resend OTP in {resendOtpTimeout}</p>
{/if}
