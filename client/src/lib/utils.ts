/** Get the public URL URL from environment variables.
 * 
 * @returns The public URL.
 */
export const getPublicUrl = () => `${import.meta.env.VITE_PUBLIC_URL || ''}`

/** Get the server URL from environment variables.
 * 
 * @returns The server URL.
 */
export const getServerUrl = () => `${import.meta.env.VITE_SERVER_URL || ''}`

/** Function to get the image path.
 * 
 * @param fileName - The name of the image file including the extension.
 * @returns The path to the image file.
 */
export const getImagePath = (fileName: string) => `${getPublicUrl()}/images/${encodeURIComponent(fileName)}`

/** Join multiple class names into a single string, filtering out any falsy values.
 * 
 * @param args - An array of class names or arrays of class names.
 * @returns A single string with all class names joined by a space.
 */
export const joinClassNames = (...args: (string | string[] | undefined)[]) => {
	return args.flatMap(cls => typeof cls === 'string' ? cls.split(' ').filter(Boolean) : cls).join(' ')
}