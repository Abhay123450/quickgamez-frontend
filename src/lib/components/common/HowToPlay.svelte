<script lang="ts">
	export let steps: string[];
</script>

<div class="flex flex-col w-full">
	<ul>
		{#each steps as step}
			<li class="w-auto px-2 py-1 my-2 border border-gray-300 rounded-md">
				<!-- <p>{step}</p> -->
				{step}
			</li>
		{/each}
	</ul>
</div>
