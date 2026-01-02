import { useEffect, useMemo, useState } from "react"

import ServiceCard from "../../components/service-card/service-card.component"
import ServiceInfo from "../../models/Service"

import "./home.styles.sass"

const HERO_IMAGE_URL = '/images/home/hero_image.png'

const HomePage: React.FC = () => {
	/** Scrolls to anchor if present in URL on initial load. */
	useEffect(() => {
		// Scroll to anchor after page loads
		const hash = window.location.hash

		if (hash) {
			const element = document.querySelector(hash)
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		}
	}, [])

	////////////////////
	/// HERO SECTION ///
	////////////////////
	// #region Hero Section

	/** The hero section of the home page.
	 * 
	 * Displays a welcome message and a call to action.
	 */
	const heroSection = useMemo(() => (
		<section id="hero-section"
			style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
		>
			<div id="hero-overlay">
				<div id="hero-text">
					<span id="hero-title">
						<h2>Welcome to</h2>
						<h1>Harmony Health</h1>
					</span>

					<p>Your partner in achieving optimal health and wellness.</p>

					<button id="get-started-button">Get Started</button>
				</div>
			</div>
		</section>
	), [])

	/////////////////////
	/// ABOUT SECTION ///
	/////////////////////
	// #region About Section

	/** The about section of the home page.
	 * 
	 * Provides information about the Harmony Health service.
	 */
	const aboutSection = useMemo(() => (
		<section id="about-section">
			<h2>About Harmony Health</h2>
			<p>At Harmony Health, we believe that true well-being comes from a balance of mind, body, and spirit. Our dedicated team of healthcare professionals is committed to providing personalized care tailored to your unique needs.</p>
			<p>Whether you're seeking preventive care, managing a chronic condition, or simply looking to enhance your overall health, Harmony Health is here to support you every step of the way. Join us on a journey towards a healthier, happier you.</p>
		</section>
	), [])

	///////////////////////////
	/// TOP SERVICE SECTION ///
	///////////////////////////
	// #region Top Service Section

	/** The top services to display on the home page. */
	const [topServices, setTopServices] = useState<ServiceInfo[]>([])

	/** Fetch the top services on initial load. */
	useEffect(() => {
		(async () => {
			const services = await ServiceInfo.find({ topService: true })
			setTopServices(services)
		})()
	}, [])

	/** The top service section of the home page.
	 * 
	 * Displays a selection of top services offered by Harmony Health.
	 */
	const topServiceSection = useMemo(() => topServices.length > 0 && (
		<section id="top-service-section">
			<div id="top-service-head">
				<h2>Our Top Services</h2>

				<a id="see-all-services-link" href="/services">See All Services</a>
			</div>

			<div id="service-cards">
				{topServices.map((service) => <ServiceCard key={service.key} service={service} />)}
			</div>
		</section>
	), [topServices])

	/////////////////
	/// RENDERING ///
	/////////////////
	// #region Rendering

	return (
		<div id='home-page' className='page'>
			{heroSection}
			{aboutSection}
			{topServiceSection}
		</div>
	)
}

export default HomePage