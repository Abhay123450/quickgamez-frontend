import type { ValidationResult } from '$lib/types/ValidationResult';

export function isEmailValid(email: string): ValidationResult {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (emailRegex.test(email)) {
		return {
			isValid: true,
			errorMessage: ''
		};
	} else {
		return {
			isValid: false,
			errorMessage: 'Invalid email'
		};
	}
}

export function isNotEmpty(value: string): ValidationResult {
	if (value.trim() === '') {
		return {
			isValid: false,
			errorMessage: 'This field is required'
		};
	} else {
		return {
			isValid: true,
			errorMessage: ''
		};
	}
}

export function isPasswordValid(password: string): ValidationResult {
	if (password.length < 6) {
		return {
			isValid: false,
			errorMessage: 'Password must be at least 6 characters'
		};
	} else {
		return {
			isValid: true,
			errorMessage: ''
		};
	}
}
