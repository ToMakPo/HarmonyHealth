import React, { useCallback, useEffect, useMemo } from 'react'
import * as ReactDOM from 'react-dom/client'

import GlobalContext, { type IGlobalContext } from './context'
import { getServerUrl } from './lib/utils'
import { apiResponse, type ApiResponse } from './lib/apiResponse'

import HomeHeader from './pages/header/header.main'
import HomePage from './pages/home/home.page'
import Employee, { type IEmployee } from './models/Employee'
import Customer, { type ICustomer } from './models/Customer'

import './colors.styles.sass'
import './main.styles.sass'

const App = () => {
	const [activeUser, setActiveUser] = React.useState<Customer | Employee | null>(null)
	const [loading, setLoading] = React.useState(true)
	const [theme, setTheme] = React.useState<'light' | 'dark'>()

	const fetchUser = useCallback(async () => {
		const response: ApiResponse = await fetch(getServerUrl() + '/api/auth/session', {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' }
		}).then(res => res.json()).catch(() => apiResponse(400, 'API_AUTH_SESSION', false, 'Network error'))

		if (!response.passed) {
			setActiveUser(null)
			return null
		}

		const user = response.focus === 'employee'
			? new Employee(response.data as IEmployee)
			: new Customer(response.data as ICustomer)
		setActiveUser(user)

		return user
	}, [])

	const globalContextValues = useMemo<IGlobalContext>(() => ({
		activeUser,
		setActiveUser,
		fetchUser
	}), [activeUser, setActiveUser, fetchUser])

	useEffect(() => {
		async function setupApp() {
			setLoading(true)
			fetchUser().then(() => setLoading(false))
		}
		setupApp()
	}, [fetchUser])

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

	return loading ? null : <>
		<GlobalContext.Provider value={globalContextValues}>
			<HomeHeader />
			<main>
				<HomePage />

				<span className="theme-toggle"
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'center',
						lineHeight: '0',
						fontSize: '22px',
						position: 'fixed',
						bottom: '20px',
						right: '20px',
						padding: '19px',
						borderRadius: '50%',
						width: '40px',
						height: '40px',
						whiteSpace: 'nowrap',
						cursor: 'pointer',
						boxSizing: 'border-box',
						userSelect: 'none',
						zIndex: 10,
					}}
				>
					<abbr title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} style={{textDecoration: 'none'}}>
					{theme === 'dark' ? '🌙' : '☀️'}
					</abbr>
				</span>
			</main>
		</GlobalContext.Provider>
	</>
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

export default App
