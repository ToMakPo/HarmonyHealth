import React, { useCallback, useEffect, useMemo } from 'react'

import GlobalContext, { type IGlobalContext } from './global-context'
import ThemeToggle from './theme-toggle/element.theme-toggle'

import HomeHeader from '../pages/header/index.header'
import HomePage from '../pages/home/page.home'
import Customer from '../models/Customer'

import { getServerUrl } from '../lib/utils'
import { apiResponse, type ApiResponse } from '../lib/apiResponse'

import './styles.colors.sass'
import './styles.icons.sass'
import './styles.app.sass'

const App = () => {
    const [loading, setLoading] = React.useState(true)

	////////////////////
	/// USER PROFILE ///
	////////////////////
	// #region User Profile
	
    const [activeUser, setActiveUser] = React.useState<Customer | null>(null)

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

        const user = new Customer(response.data as Customer)

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

	// #endregion

    return loading ? null : (
        <GlobalContext.Provider value={globalContextValues}>
            <HomeHeader />
            <main>
                <HomePage />
            </main>
            <ThemeToggle />
        </GlobalContext.Provider>
    )
}

export default App