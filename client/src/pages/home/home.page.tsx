import HeroPage from '../sections/hero/hero.page'
import AboutPage from '../sections/about/about.page'
import ServicesPage from '../sections/services/services.page'
import ContactPage from '../sections/contact/contact.page'
import MapPage from '../sections/map/map.page'
import Footer from '../../layout/footer/footer.layout'

import './home.styles.scss'

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
