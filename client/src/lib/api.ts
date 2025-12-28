function getUrl(apiPath: string) : string {
	const serverUrl = new URL(import.meta.env.VITE_SERVER_URL || '', window.location.href).toString()

	if (apiPath.startsWith('/')) apiPath = apiPath.slice(1)
	if (!apiPath.startsWith('api')) apiPath = 'api/' + apiPath
	if (apiPath.endsWith('/')) apiPath = apiPath.slice(0, -1)

	return serverUrl + apiPath
}

export const api = {
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