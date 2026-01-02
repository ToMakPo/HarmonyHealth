import React, { useEffect, useState } from 'react'

import './theme-toggle.style.sass'

/** Theme Toggle Element
 * 
 * Toggles between light and dark themes, saving preference to localStorage.
 * 
 * This element should only be used on the main application page.
 * 
 * @returns Theme toggle button element
 */
const ThemeToggle: React.FC = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>()

	useEffect(() => {
		// Load saved theme from localStorage or system preference.
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

		setTheme(savedTheme ?? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'))
	}, [])

	useEffect(() => {
		// Apply the theme to the document and save to localStorage.
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme)
			localStorage.setItem('theme', theme)
		}
	}, [theme])

	return(
		<span 
			id='theme-toggle' 
			className={`icon ${theme === 'dark' ? 'moon' : 'sun'}`}
			title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		></span>
	)
}

export default ThemeToggle