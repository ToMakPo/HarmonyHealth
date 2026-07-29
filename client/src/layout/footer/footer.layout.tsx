import React from 'react'
import { useNavigate } from 'react-router-dom'
import './footer.styles.scss'

function Footer() {
	const navigate = useNavigate()

	const handlePrivacyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault() // Prevents unexpected layout refreshes

		// If you want to just navigate to the page and start at the top:
		navigate('/privacy-policy')

		// OR if you explicitly want to scroll to a specific ID container on that page:
		// scrollToHashElement('/privacy-policy', 'privacy-policy-content', navigate)
	}

	return (
		<footer id='page-footer'>
			<div id='legal'>
				<span>&copy; {new Date().getFullYear()} Harmony Health Wellness Center</span>
				<span>All Rights Reserved</span>

				<button type='button' className='footer-link-btn' onClick={handlePrivacyClick}>
					Privacy Policy
				</button>
			</div>
		</footer>
	)
}

export default Footer
