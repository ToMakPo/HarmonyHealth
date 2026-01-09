/** Response interface for API functions. */
export interface ApiResponse {
	passed: boolean
	sender: string
	code: number
	message: string
	data?: Record<string, unknown> | null
	focus?: string
}

/** This function generates a response object.
 *
 * @param passed The passed flag indicates whether the function that generated the response was successful.
 * @param sender The sender is a string that identifies the source or component that generated the response.
 * @param code The code is a numeric status code representing the result of the operation.
 * @param message The message is a human-readable string that describes the response.
 * @param data The data is an optional field that can contain any data that the function that generated the response wants to return.
 * @param focus The focus is an optional field that can contain the name of a field that the function that generated the response wants to focus on.
 *
 * @returns {ApiResponse} The response object.
 */
export const apiResponse = (
	passed: ApiResponse['passed'],
	sender: ApiResponse['sender'],
	code: ApiResponse['code'],
	message: ApiResponse['message'],
	data?: ApiResponse['data'],
	focus?: ApiResponse['focus']
): ApiResponse => {
	return { passed, sender, code, message, data, focus }
}
