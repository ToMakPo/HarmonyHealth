import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
	/** The current theme
	 *
	 * This value determines the current color scheme of the application, which
	 * can be either 'light' or 'dark'. By default, this value is determined
	 * based on the user's system preference, but it can be explicitly set
	 * using the setTheme function or toggled using the toggleTheme function.
	 *
	 * @values 'light' | 'dark'
	 */
	theme: Theme
	/** Sets the current theme
	 *
	 * This function allows explicitly setting the current theme to either
	 * 'light' or 'dark'. Calling this function will update the theme state
	 * and persist the selection.
	 *
	 * @param theme The theme to set.
	 *
	 * The theme parameter can be one of the following:
	 * - **light**: explicitly sets the theme to light mode
	 * - **dark**: explicitly sets the theme to dark mode
	 * - **system**: sets the theme based on the system preference
	 * - **toggle**: switches the theme between light and dark
	 */
	setTheme: (theme: Theme | 'system' | 'toggle') => void
}

/** Represents the possible theme values for the application. */
export type Theme = 'light' | 'dark'

/**
 * Retrieves the user's system color scheme preference.
 *
 * This function checks the system-level color scheme preference and returns
 * either 'light' or 'dark' depending on whether the system prefers dark mode.
 *
 * If the code is running in a non-browser environment, it defaults to 'light'.
 *
 * @returns 'light' | 'dark' indicating the system color scheme preference.
 */
function getSystemPreference(): Theme {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Updates the DOM color scheme to match the resolved theme.
 *
 * This function sets the `color-scheme` style property on the document's root
 * element to ensure that CSS color-scheme-aware styles and functions like
 * `light-dark()` and `hsl(from...)` re-evaluate correctly when the theme changes.
 *
 * @param resolvedTheme The resolved theme, either 'light' or 'dark'.
 */
function updateDOMColorScheme(resolvedTheme: Theme) {
	if (typeof window === 'undefined') return
	// This forces light-dark() and hsl(from...) to re-evaluate perfectly
	window.document.documentElement.style.colorScheme = resolvedTheme
}

/** Zustand store hook for managing the application's theme state.
 *
 * This store provides the current theme and a function to update it. The theme
 * can be explicitly set to 'light', 'dark', 'system', or toggled between light
 * and dark. The store persists the theme selection and ensures the DOM color
 * scheme is updated whenever the theme changes.
 */
export const useTheme = create<ThemeState>()(
	persist(
		(set, get) => {
			const theme = getSystemPreference()
			const setTheme: ThemeState['setTheme'] = theme => {
				if (theme === 'toggle') {
					theme = get().theme === 'light' ? 'dark' : 'light'
				} else if (theme === 'system') {
					theme = getSystemPreference()
				}
				set({ theme })
				updateDOMColorScheme(theme)
			}

			return { theme, setTheme }
		},
		{ name: 'theme' }
	)
)
