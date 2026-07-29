import { useNavigate } from 'react-router-dom'
import { scrollToHashElement } from '../../app'
import logo from '../../assets/images/logo/harmony_logo_full.svg'
import useBreakpoint from '../../store/breakpoint'

import './header.styles.scss'
import BookingButton from '../../components/booking/booking-button.component'

function PageHeader() {
	const navigate = useNavigate() // Hook into React Router's internal navigator
	const currentBreakpoint = useBreakpoint(state => state.currentBreakpoint)

	const navLinks = [
		{ ref: '/', to: 'about-page', label: 'About' },
		{ ref: '/', to: 'services-page', label: 'Services' },
		{ ref: '/', to: 'contact-page', label: 'Contact' },
		{ ref: '/', to: 'map-page', label: 'Map' }
	]

	// Clear mobile popovers manually when a routing action fires
	const handleMobileNavClick = (ref: string, to: string) => {
		scrollToHashElement(ref, to, navigate)

		const popover = document.getElementById('mobile-nav-popover')
		if (popover && popover.hidePopover) {
			popover.hidePopover()
		}
	}

	const logoElement = (
		<img
			src={logo}
			id='page-header-logo'
			alt='Harmony Health page header logo'
			onClick={() => scrollToHashElement('/', 'hero-page', navigate)} // Pass navigate here too
		/>
	)

	const desktopNav = (
		<nav>
			{navLinks.map(link => (
				<button
					key={link.to}
					type='button' // Explicit type stops form/refresh bugs
					onClick={() => scrollToHashElement(link.ref, link.to, navigate)} // Pass navigate down
				>
					{link.label}
				</button>
			))}
			<BookingButton />
		</nav>
	)

	const mobileNav = (
		<>
			<button
				id='mobile-nav-button'
				type='button'
				popoverTarget='mobile-nav-popover' // Changed from popovertarget to popoverTarget
				aria-label='Toggle navigation menu'
			>
				<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path d='M 3 6 H 21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
					<path d='M 3 12 H 21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
					<path d='M 3 18 H 21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			</button>

			<div id='mobile-nav-popover' popover='auto'>
				<nav>
					{navLinks.map(link => (
						<button
							key={link.to}
							type='button'
							onClick={() => handleMobileNavClick(link.ref, link.to)} // Uses popover dismiss handler
						>
							{link.label}
						</button>
					))}
					<BookingButton />
				</nav>
			</div>
		</>
	)

	return (
		<header id='page-header'>
			{logoElement}
			{currentBreakpoint === 'desktop' ? desktopNav : mobileNav}
		</header>
	)
}

export default PageHeader
