import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ThemeToggle from './theme-toggle/app.theme-toggle'
import AppHeader from './header/app.header'

import HomePage from '../pages/home/page.home'

import Customer from '../models/Customer'
import CustomerLoginModal from "../pages/auth/modal.login"
import CustomerRegisterModal from "../pages/auth/modal.register"

import GlobalContext, { type IGlobalContext } from './global-context'

import { getServerUrl } from '../lib/utils'
import { apiResponse, type ApiResponse } from '../lib/apiResponse'

import './styles.colors.sass'
import './styles.icons.sass'
import './styles.app.sass'
import type { ModalRef } from '../components/modal/component.modal'

const App: React.FC = () => {
    const [loading, setLoading] = useState(true)

	////////////////////
	/// USER PROFILE ///
	////////////////////
	// #region User Profile
	
    const [activeUser, setActiveUser] = useState<Customer | null>(null)

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



	////////////////////////////
	/// CUSTOMER AUTH MODALS ///
	////////////////////////////
	// #region Customer Auth
	
	const [showLoginModal, setShowLoginModal] = useState(false)
	const loginModalRef = useRef<ModalRef>(null)

	const [showRegisterModal, setShowRegisterModal] = useState(false)
	const registerModalRef = useRef<ModalRef>(null)

	const loginModal = (
		<CustomerLoginModal
			id="customer-login-modal" 
			open={showLoginModal}
			onClose={() => setShowLoginModal(false)}
			setShowRegister={setShowRegisterModal}
			ref={loginModalRef}
		/>
	)
	const registerModal = (
		<CustomerRegisterModal
			id="customer-register-modal"
			open={showRegisterModal}
			onClose={() => setShowRegisterModal(false)}
			setShowLogin={setShowLoginModal}
			ref={registerModalRef}
		/>
	)

	// #endregion



    return loading ? null : (
        <GlobalContext.Provider value={globalContextValues}>
            <AppHeader />
            
            <main>
                <HomePage />
            </main>

            <ThemeToggle />

            {loginModal}
            {registerModal}
        </GlobalContext.Provider>
    )
}

export default App