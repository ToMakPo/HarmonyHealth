import { useRef, useState } from "react"
import CustomerLoginModal from "../header/customer-login.modal"
import CustomerRegisterModal from "../header/customer-register.modal"
import type { ModalRef } from "../../components/modal/modal.component"
import { getImagePath } from "../../lib/utils"

const HomePage: React.FC = () => {
	////////////////////
	/// HERO SECTION ///
	////////////////////
	// #region Hero Section

	const heroImageUrl = getImagePath('hero_image.png')
	const heroSection = (
		<section className="hero-section">
			<img src={heroImageUrl} alt="Hero" className="hero-image" />
		</section>
	)

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

	return <>
		<div id='home-page' className='page'>
			{heroSection}
		</div>

		{loginModal}
		{registerModal}
	</>
}

export default HomePage