import { scrollToHashElement } from '../../app'
import logo from '../../assets/images/logo/harmony_logo_full.svg'
import useBreakpoint from '../../store/breakpoint'

import './header.styles.scss'

function PageHeader() {
	const navLinks = [
		{ to: 'about-page', label: 'About' },
		{ to: 'services-page', label: 'Services' },
		{ to: 'contact-page', label: 'Contact' }
	]

	const currentBreakpoint = useBreakpoint(state => state.currentBreakpoint)

	const desktopNav = (
		<nav>
			{navLinks.map(link => (
				<button key={link.to} onClick={() => scrollToHashElement({ id: link.to })}>
					{link.label}
				</button>
			))}
		</nav>
	)

	const mobileNav = (
		<>
			<button id='mobile-nav-button' popoverTarget='mobile-nav-popover'>
				<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path d='M 3  6 H 21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
					<path d='M 3 12 H 21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
					<path d='M 3 18 H 21' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			</button>

			<div id='mobile-nav-popover' popover='auto'>
				{navLinks.map(link => (
					<button key={link.to} onClick={() => scrollToHashElement({ id: link.to })}>
						{link.label}
					</button>
				))}
			</div>
		</>
	)

	return (
		<header id='page-header'>
			<img src={logo} alt='Harmony Health page header logo' onClick={() => scrollToHashElement({ id: 'hero-page' })} />

			{currentBreakpoint === 'desktop' ? desktopNav : mobileNav}
		</header>
	)
}

export default PageHeader
