/** Response interface for API functions. */
export interface ApiResponse {
	/** Indicates whether the action was successful. */
	passed: boolean
	/** Identifies the source or component that generated the response. */
	sender: string
	/** Numeric status code representing the result of the operation. */
	code: number
	/** Human-readable message describing the response. */
	message: string
	/** Optional data returned by the function that generated the response. */
	data?: Record<string, unknown> | null
	/** Optional field name to focus on in case of an error. */
	focus?: string
}

/** This function generates a response object.
 *
 * @param passed Indicates whether the action was successful.
 * @param sender Identifies the source or component that generated the response.
 * @param code Numeric status code representing the result of the operation.
 * @param message Human-readable message describing the response.
 * @param data Optional data returned by the function that generated the response.
 * @param focus Optional field name to focus on in case of an error.
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
