import HeroPage from '../hero/hero.page'
import AboutPage from '../about/about.page'
import ServicesPage from '../services/services.page'
import ContactPage from '../contact/contact.page'
import Footer from '../../layout/footer/footer.layout'

import './home.styles.scss'
import MapPage from '../map/map.page'

function HomePage() {
	return (
		<main id='home-page'>
			<HeroPage />
			<AboutPage />
			<ServicesPage />
			<ContactPage />
			<MapPage />
			<Footer />
		</main>
	)
}

export default HomePage
