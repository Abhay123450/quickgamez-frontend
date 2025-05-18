<script lang="ts">
	import { serializeSchema } from './serializeSchems';

	export let schema: Object;
</script>

<svelte:head>
	{@html serializeSchema(schema)}
</svelte:head>
