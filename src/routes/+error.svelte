<script lang="ts">
	import { page } from '$app/stores';
	import TopNav from '$lib/components/common/TopNav.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { IoHomeOutline } from 'svelte-icons-pack/io';
	import { TrOutlineError404 } from 'svelte-icons-pack/tr';
</script>

<div class="flex flex-col h-full">
	<TopNav />
	<div class="flex flex-col grow h-full items-center justify-center px-2">
		<div class="flex flex-col text-neutral-600 items-center mb-16">
			<Icon src={TrOutlineError404} className="w-16 h-16 {$page.status === 404 ? '' : 'hidden'}" />
			<p class="text-3xl font-mono">{$page.error?.message}</p>
		</div>
		<hr class="border-t border-neutral-400" />
		<p class="text-xl text-neutral-800 mb-2">You seem to be lost.</p>
		<a
			href="/"
			class="flex text-xl justify-center items-center text-neutral-800 border border-neutral-500 rounded-md px-2 py-1 mt-2
				hover:bg-yellow-200"
		>
			<Icon src={IoHomeOutline} className="w-6 h-6 me-1.5" />
			Return Home
		</a>
	</div>
</div>
