export function serializeSchema(thing: any) {
	return `<script type="application/ld+json">${JSON.stringify(thing)}</script>`;
}
