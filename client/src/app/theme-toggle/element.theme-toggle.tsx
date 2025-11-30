import React, { useEffect, useState } from 'react'
import './style.theme-toggle.sass'

/**
 * Theme Toggle Element
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
		// Set theme on initial load
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

		setTheme(savedTheme ?? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'))
	}, [])

	useEffect(() => {
		// Update theme class on <html> element
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme)
			localStorage.setItem('theme', theme)
		}
	}, [theme])

	return(
		<span className="theme-toggle"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			<abbr title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
				{theme === 'dark' ? '🌙' : '☀️'}
			</abbr>
		</span>
	)
}

export default ThemeToggle