/**
 * Response interface
 *
 * @interface ApiResponse
 * @param {number} id The id is a unique identifier for the response within the function that generated it.
 * @param {string} code The code is a unique identifier for the function that generated the response.
 * @param {boolean} passed The passed flag indicates whether the function that generated the response was successful.
 * @param {string} message The message is a human-readable string that describes the response.
 * @param {any} data The data is an optional field that can contain any data that the function that generated the response wants to return.
 * @param {string} focus The focus is an optional field that can contain the name of a field that the function that generated the response wants to focus on.
 *
 * @note The ID and code combination is used to identify the response and should be unique.
 */
export interface ApiResponse {
	id: number
	code: string
	passed: boolean
	message: string
	data?: any
	focus?: string
}

/**
 * This function generates a response object.
 *
 * @param {number} id The id is a unique identifier for the response within the function that generated it.
 * @param {string} code The code is a unique identifier for the function that generated the response.
 * @param {boolean} passed The passed flag indicates whether the function that generated the response was successful.
 * @param {string} message The message is a human-readable string that describes the response.
 * @param {any} data The data is an optional field that can contain any data that the function that generated the response wants to return.
 * @param {string} focus The focus is an optional field that can contain the name of a field that the function that generated the response wants to focus on.
 *
 * @returns {ApiResponse} The response object.
 */
export const apiResponse = (id: number, code: string, passed: boolean, message: string, data?: any, focus?: string): ApiResponse => {
	return { id, code, passed, message, data, focus } as ApiResponse
}
