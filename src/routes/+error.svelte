<script lang="ts">
	import { page } from '$app/stores';
	import TopNav from '$lib/components/common/TopNav.svelte';
</script>

<div class="flex flex-col">
	<TopNav />
	<h1 class="text-red-500 text-3xl">{$page.status} {$page.error?.message}</h1>
</div>
