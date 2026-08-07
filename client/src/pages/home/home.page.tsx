import HeroSection from './sections/hero/hero.section'
import AboutSection from './sections/about/about.section'
import ServicesSection from './sections/services/services.section'
import ContactSection from './sections/contact/contact.section'
import MapSection from './sections/map/map.section'
import Footer from '../../layout/footer/footer.layout'

import './home.styles.scss'

function HomePage() {
	return (
		<main id='home-page'>
			<HeroSection />
			<AboutSection />
			<ServicesSection />
			<ContactSection />
			<MapSection />
			<Footer />
		</main>
	)
}

export default HomePage
