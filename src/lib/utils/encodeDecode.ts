const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Convert UTF-8 string to byte array
export function utf8Encode(str: string): number[] {
	const encoder = new TextEncoder();
	return Array.from(encoder.encode(str));
}

// Convert byte array to UTF-8 string
export function utf8Decode(bytes: number[]): string {
	const decoder = new TextDecoder();
	return decoder.decode(new Uint8Array(bytes));
}

// Encode string to Base64
export function base64Encode(str: string): string {
	const bytes = utf8Encode(str);
	let binary = '';
	for (const byte of bytes) {
		binary += byte.toString(2).padStart(8, '0');
	}

	let base64 = '';
	for (let i = 0; i < binary.length; i += 6) {
		const chunk = binary.slice(i, i + 6).padEnd(6, '0');
		const index = parseInt(chunk, 2);
		base64 += base64Chars[index];
	}

	while (base64.length % 4 !== 0) {
		base64 += '=';
	}

	return base64;
}

// Decode Base64 string to original string
export function base64Decode(base64: string): string {
	base64 = base64.replace(/=+$/, '');

	let binary = '';
	for (let i = 0; i < base64.length; i++) {
		const index = base64Chars.indexOf(base64[i]);
		if (index === -1) throw new Error('Invalid Base64 character');
		binary += index.toString(2).padStart(6, '0');
	}

	const bytes: number[] = [];
	for (let i = 0; i < binary.length; i += 8) {
		const byte = binary.slice(i, i + 8);
		if (byte.length === 8) {
			bytes.push(parseInt(byte, 2));
		}
	}

	return utf8Decode(bytes);
}

// Encode JSON object to Base64 string
export function encodeJSON(obj: unknown): string {
	return base64Encode(JSON.stringify(obj));
}

// Decode Base64 string to JSON object
export function decodeJSON(encoded: string): unknown {
	return JSON.parse(base64Decode(encoded));
}
