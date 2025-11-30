import { useEffect, useMemo, useRef, useState } from 'react'

import ThemeToggle from './theme-toggle/app.theme-toggle'
import AppHeader from './header/app.header'

import HomePage from '../pages/home/page.home'

import Customer from '../models/Customer'
import CustomerLoginModal from "../pages/auth/modal.login"
import CustomerRegisterModal from "../pages/auth/modal.register"

import GlobalContext, { type IGlobalContext } from './global-context'

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
	
    const globalContextValues = useMemo<IGlobalContext>(() => ({
        activeUser,
        setActiveUser
    }), [activeUser, setActiveUser])

    useEffect(() => {
        async function setupApp() {
            setLoading(true)
            Customer.fetchActive(setActiveUser).then(() => setLoading(false))
        }
        setupApp()
    }, [])

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