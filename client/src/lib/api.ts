/**
 * Constructs the full URL for an API endpoint based on the provided path.
 * 
 * @param apiPath The API endpoint path. `/api/` prefix will be added if missing.
 * @returns The full URL for the API endpoint.
 */
function getUrl(apiPath: string) : string {
	const serverUrl = new URL(import.meta.env.VITE_SERVER_URL || '', window.location.href).toString()

	if (apiPath.startsWith('/')) apiPath = apiPath.slice(1)
	if (!apiPath.startsWith('api')) apiPath = 'api/' + apiPath
	if (apiPath.endsWith('/')) apiPath = apiPath.slice(0, -1)

	return serverUrl + apiPath
}

/** A simple API client for making HTTP requests to the server. */
export const api = {
	/** Makes a GET request to the specified API endpoint.
	 * 
	 * Used to select data from the server.
	 * 
	 * @param apiPath The API endpoint path. `/api/` prefix will be added if missing.
	 * @param query Optional query parameters to include in the request.
	 * @param options Additional fetch options.
	 * @returns The response data as a JSON object.
	 */
	async get(apiPath: string, query?: Record<string, unknown>, options?: RequestInit) {
		if (query && Object.keys(query).length > 0) {
			const queryString = new URLSearchParams(query as Record<string, string>).toString();
			apiPath += `?${queryString}`;
		}

		const response = await fetch(getUrl(apiPath), {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			...options
		});
		return response.json();
	},

	/** Makes a POST request to the specified API endpoint.
	 * 
	 * Used to create new data on the server.
	 * 
	 * @param apiPath The API endpoint path. `/api/` prefix will be added if missing.
	 * @param data The data to be sent in the request body.
	 * @param options Additional fetch options.
	 * @returns The response data as a JSON object.
	 */
	async post(apiPath: string, data?: Record<string, unknown>, options?: RequestInit) {
		const response = await fetch(getUrl(apiPath), {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			...options
		});
		return response.json();
	},

	/** Makes a PUT request to the specified API endpoint.
	 * 
	 * Used to update existing data on the server.
	 * 
	 * @param apiPath The API endpoint path. `/api/` prefix will be added if missing.
	 * @param data The data to be sent in the request body.
	 * @param options Additional fetch options.
	 * @returns The response data as a JSON object.
	 */
	async put(apiPath: string, data?: Record<string, unknown>, options?: RequestInit) {
		const response = await fetch(getUrl(apiPath), {
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			...options
		});
		return response.json();
	},

	/** Makes a DELETE request to the specified API endpoint.
	 * 
	 * Used to delete data from the server.
	 * 
	 * @param apiPath The API endpoint path. `/api/` prefix will be added if missing.
	 * @param data The data to be sent in the request body.
	 * @param options Additional fetch options.
	 * @returns The response data as a JSON object.
	 */
	async delete(apiPath: string, data?: Record<string, unknown>, options?: RequestInit) {
		const response = await fetch(getUrl(apiPath), {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			...options
		});
		return response.json();
	}
}