<script lang="ts">
	import { serializeSchema } from './serializeSchems';

	export let schema: Object;
</script>

{@html serializeSchema(schema)}
