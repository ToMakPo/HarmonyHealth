import { scrollToHashElement } from '../../app'
import logo from '../../assets/images/logo/harmony_logo_full.svg'

import './header.styles.scss'

function PageHeader() {
	const navLinks = [
		{ to: 'about-page', label: 'About' },
		{ to: 'services-page', label: 'Services' },
		{ to: 'contact-page', label: 'Contact' }
	]

	return (
		<header id='page-header'>
			<img src={logo} alt='Harmony Health page header logo' onClick={() => scrollToHashElement({ id: 'hero-page' })} />

			<nav>
				{navLinks.map(link => {
					return (
						<button key={link.to} onClick={() => scrollToHashElement({ id: link.to })}>
							{link.label}
						</button>
						// <Link key={link.to} to={link.to}>{link.label}</Link>
					)
				})}
			</nav>
		</header>
	)
}

export default PageHeader
