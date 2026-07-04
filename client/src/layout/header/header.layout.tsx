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
				<Link to='/about'>About</Link>
				<Link to='/services'>Services</Link>
				<Link to='/contact'>Contact</Link>
			</nav>
		</header>
	)
}

export default PageHeader
