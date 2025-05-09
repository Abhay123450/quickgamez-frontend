export function removeWhitespaces(str: string) {
	return str.replace(/\s/g, '');
}

export function removeNewlines(str: string) {
	return str.replace(/\n/g, '');
}

export function removeTabs(str: string) {
	return str.replace(/\t/g, '');
}
