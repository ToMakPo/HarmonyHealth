import { useRef, useState } from "react"
import CustomerLoginModal from "./customer-login.modal"
import CustomerRegisterModal from "./customer-register.modal"
import type { ModalRef } from "../../components/modal/modal.component"

const HomePage: React.FC = () => {
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

	return <>
		<div>
			<h1>Welcome to Harmony Health</h1>
			<p>Your journey to better health starts here.</p>

			<div className="button-group">
				<button type="button" onClick={() => setShowLoginModal(true)}>Login</button>
				<button type="button" onClick={() => setShowRegisterModal(true)}>Register</button>
			</div>
		</div>

		{loginModal}
		{registerModal}
	</>
}

export default HomePage