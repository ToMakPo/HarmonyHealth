import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo/harmony_logo_full.svg'

import './header.styles.scss'

function PageHeader() {
	return (
		<header id='page-header'>
			<Link to='/'>
				<img src={logo} alt='Harmony Health page header logo' />
			</Link>

			<nav>
				<Link to='/#about-page'>About</Link>
				<Link to='/#services-page'>Services</Link>
				<Link to='/#contact-page'>Contact</Link>
			</nav>
		</header>
	)
}

export default PageHeader
