// import { refreshToken } from './refreshToken';
import { API_ROUTES } from '$lib/constants/apiRoutes';
import { isLoginPanelOpen } from '../../routes/stores';
export type FetchError = {
	error: string;
	errorCode: string;
};
/**
 * Makes a request to the given URL with the given method (GET or POST),
 * and optional body. Returns the response as a JSON object, or null if
 * the request fails.
 *
 * @param method - The HTTP method to use ('GET' or 'POST')
 * @param url - The URL to send the request to
 * @returns The response as a JSON object, or null if the request fails
 */
export async function svelteFetchRequest(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	method: 'GET',
	url: string
): Promise<any | null>;
/**
 * Makes a request to the given URL with the given method (GET or POST),
 * and optional body. Returns the response as a JSON object, or null if
 * the request fails.
 *
 * @param method - The HTTP method to use ('GET' or 'POST')
 * @param url - The URL to send the request to
 * @param body - The request body for POST requests
 * @returns The response as a JSON object, or null if the request fails
 */
export async function svelteFetchRequest(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	method: 'POST',
	url: string,
	body: any
): Promise<any | null>;

/**
 * Makes a request to the given URL with the given method (GET or POST),
 * and optional body. Returns the response as a JSON object, or null if
 * the request fails.
 *
 * @param method - The HTTP method to use ('GET' or 'POST')
 * @param url - The URL to send the request to
 * @param body - The request body for POST requests (optional)
 * @returns The response as a JSON object, or null if the request fails
 */
export async function svelteFetchRequest(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	method: 'GET' | 'POST',
	url: string,
	body?: any
): Promise<any | null> {
	const options: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	};

	if (method === 'POST' && body) {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(url, options);
	const responseJson = await response.json();
	console.table(responseJson);

	if (!('success' in responseJson)) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	if (!responseJson.success && responseJson.errorCode === 'TOKEN_EXPIRED') {
		await refreshLogin();

		const options: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};

		if (method === 'POST' && body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);
		const responseJson = await response.json();

		if (!('success' in responseJson)) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		if (!responseJson.success && responseJson.errorCode === 'TOKEN_EXPIRED') {
			// require login
			console.log('require login');
		}

		return responseJson;
	}

	return responseJson;
}

// function axiosRequest(method: ) {}

/**
 * Makes a request to the given URL with the given method (GET or POST),
 * and optional body. Returns the response as a JSON object, or null if
 * the request fails.
 *
 * @param method - The HTTP method to use ('GET' or 'POST')
 * @param url - The URL to send the request to
 * @returns The response as a JSON object, or null if the request fails
 */
export async function fetchRequest(method: 'GET', url: string): Promise<any | null>;
/**
 * Makes a request to the given URL with the given method (GET or POST),
 * and optional body. Returns the response as a JSON object, or null if
 * the request fails.
 *
 * @param method - The HTTP method to use ('GET' or 'POST')
 * @param url - The URL to send the request to
 * @param body - The request body for POST requests
 * @returns The response as a JSON object, or null if the request fails
 */
export async function fetchRequest(method: 'POST', url: string, body: any): Promise<any | null>;

/**
 * Makes a request to the given URL with the given method (GET or POST),
 * and optional body. Returns the response as a JSON object, or null if
 * the request fails.
 *
 * @param method - The HTTP method to use ('GET' or 'POST')
 * @param url - The URL to send the request to
 * @param body - The request body for POST requests (optional)
 * @returns The response as a JSON object, or null if the request fails
 */
export async function fetchRequest(
	method: 'GET' | 'POST',
	url: string,
	body?: any
): Promise<any | null> {
	const options: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	};

	if (method === 'POST' && body) {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(url, options);
	const responseJson = await response.json();
	console.table(responseJson);

	if (!('success' in responseJson)) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	if (!responseJson.success && responseJson.errorCode === 'TOKEN_EXPIRED') {
		const [error, isLoggedIn] = await refreshLogin();

		if (isLoggedIn === 'LOGIN_REQUIRED') {
			return { error: 'LOGIN_REQUIRED' };
		}

		const options: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		};

		if (method === 'POST' && body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);
		const responseJson = await response.json();

		if (!('success' in responseJson)) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		if (!responseJson.success && responseJson.errorCode === 'TOKEN_EXPIRED') {
			// require login
			console.log('require login');
		}

		return responseJson;
	}

	return responseJson;
}

export async function refreshLogin(
	urlOrigin: string = 'http://localhost:4000'
): Promise<[FetchError | null, 'SUCCESS' | 'LOGIN_REQUIRED' | 'ERROR']> {
	console.log(`refreshing login`);
	const response = await fetch(new URL(API_ROUTES.USER.AUTH.REFRESH_ACCESS_TOKEN), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
	const responseJson = await response.json();
	console.log(`login response ${JSON.stringify(responseJson)}`);
	if ('success' in responseJson && responseJson.success) {
		// setTimeout(
		// 	() => {
		// 		refreshLogin(fetch);
		// 	},
		// 	59 * 60 * 1000 // 59 minutes (1 min before the token expires)
		// );
		return [null, 'SUCCESS'];
	} else if (!responseJson.success) {
		return [{ error: responseJson.message, errorCode: responseJson.errorCode }, 'ERROR'];
		console.table(responseJson);
	}
	console.log(responseJson);
	return [{ error: 'An error occurred', errorCode: 'UNKNOWN' }, 'ERROR'];
}

export async function getRequest(
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	url: string
): Promise<{ error: any; data: any }> {
	const request = new Request(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
	const response = await fetch(request);
	const responseJson = await response.json();
	if (!('success' in responseJson)) {
		throw new Error('Error in response.');
	}
	const { success, message, data, errorCode } = responseJson;
	if (success) {
		return {
			error: null,
			data
		};
	}
	if (errorCode === 'TOKEN_EXPIRED') {
		return {
			error: 'TOKEN_EXPIRED',
			data: null
		};
	} else if (errorCode === 'LOGIN_REQUIRED') {
		return {
			error: 'LOGIN_REQUIRED',
			data: null
		};
	} else {
		return {
			error: message,
			data: null
		};
	}
}

export async function fetchWithTokenRefresh<T>(
	url: URL,
	request: RequestInit
): Promise<[FetchError, null] | [null, T]> {
	try {
		request = {
			headers: {
				'Content-Type': 'application/json',
				...request.headers
			},
			credentials: 'include',
			...request
		};

		console.info(`fetchWithTokenRefresh ${url} ${JSON.stringify(request)}`);

		const response = await fetch(url, request);
		const responseJson = await response.json();

		if (!('success' in responseJson)) {
			return [{ error: 'An error occurred', errorCode: 'UNKNOWN' }, null];
		}

		if (!responseJson.success && responseJson.errorCode === 'VALIDATION_ERROR') {
			return [{ error: responseJson.errors, errorCode: responseJson.errorCode }, null];
		}
		if (!responseJson.success && responseJson.errorCode === 'TOKEN_EXPIRED') {
			const [error, isLoggedIn] = await refreshLogin(url.origin);
			if (error) {
				return [error, null];
			}
			const response = await fetch(url, request);
			const responseJson = await response.json();
			if (!('success' in responseJson)) {
				return [{ error: 'An error occurred', errorCode: 'UNKNOWN' }, null];
			} else if (!responseJson.success) {
				return [{ error: responseJson.message, errorCode: responseJson.errorCode }, null];
			}
			return [null, responseJson.data];
		} else if (!responseJson.success) {
			return [{ error: responseJson.message, errorCode: responseJson.errorCode }, null];
		}
		return [null, responseJson.data];
	} catch (error) {
		return [{ error: 'An error occurred.', errorCode: 'UNKNOWN' }, null];
	}
}
