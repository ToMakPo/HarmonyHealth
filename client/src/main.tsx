import React, { useCallback, useEffect, useMemo } from 'react'
import * as ReactDOM from 'react-dom/client'
import './styles.sass'
import HomePage from './pages/home/home.page'
import Employee from './models/Employee'
import Customer, { type ICustomer } from './models/Customer'
import { getServerUrl } from './lib/utils'
import { apiResponse, type ApiResponse } from './lib/apiResponse'
import type { IEmployee } from './models/Employee'
import GlobalContext, { type IGlobalContext } from './context'

const App = () => {
	const [activeUser, setActiveUser] = React.useState<Customer | Employee | null>(null)
	const [loading, setLoading] = React.useState(true)

	const fetchUser = useCallback(async () => {
		const response: ApiResponse = await fetch(getServerUrl() + '/api/auth/session', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
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

	return loading ? null : <>
		<GlobalContext.Provider value={globalContextValues}>
			<HomePage />
		</GlobalContext.Provider>
	</>
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

export default App
