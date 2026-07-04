import HeroPage from '../hero/hero.page'
import AboutPage from '../about/about.page'
import ServicesPage from '../services/services.page'
import ContactPage from '../contact/contact.page'

import './home.styles.scss'

function HomePage() {
	return (
		<main id='home-page'>
			<HeroPage />
			<AboutPage />
			<ServicesPage />
			<ContactPage />
		</main>
	)
}

export default HomePage
