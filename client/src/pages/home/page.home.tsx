import { useEffect, useState } from "react"

import ServiceCard from "../../components/service-card/component.service-card"
import { getImagePath } from "../../lib/utils"
import ServiceInfo from "../../models/Service"

import "./styles.home.sass"

const HomePage: React.FC = () => {

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

	const heroImageUrl = '/images/hero_image.png'
	const heroSection = (
		<section id="hero-section"
			style={{ backgroundImage: `url(${heroImageUrl})` }}
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
	)

	// #endregion



	/////////////////////
	/// ABOUT SECTION ///
	/////////////////////
	// #region About Section

	const aboutSection = (
		<section id="about-section">
			<h2>About Harmony Health</h2>
			<p>At Harmony Health, we believe that true well-being comes from a balance of mind, body, and spirit. Our dedicated team of healthcare professionals is committed to providing personalized care tailored to your unique needs.</p>
			<p>Whether you're seeking preventive care, managing a chronic condition, or simply looking to enhance your overall health, Harmony Health is here to support you every step of the way. Join us on a journey towards a healthier, happier you.</p>
		</section>
	)

	// #endregion


	///////////////////////////
	/// TOP SERVICE SECTION ///
	///////////////////////////
	// #region Top Service Section
	const [topServices, setTopServices] = useState<ServiceInfo[]>([])
	const [loadingTopServices, setLoadingTopServices] = useState(false)

	useEffect(() => {
		const fetchTopServices = async () => {
			try {
				setLoadingTopServices(true)
				const services = await ServiceInfo.find({ topService: true }) // Fetch top services
				setTopServices(services)
			} catch (error) {
				console.error('Error fetching top services:', error)
				setTopServices([])
			} finally {
				setLoadingTopServices(false)
			}
		}

		fetchTopServices()
	}, [])

	const topServiceSection = (
		<section id="top-service-section">
			<div id="top-service-head">
				<h2>Our Top Services</h2>

				<a id="see-all-services-link" href="/services">See All Services</a>
			</div>

			<div id="service-cards">
				{!loadingTopServices && topServices.length > 0 ? topServices.map((service, index) => (
					<ServiceCard key={index}
						title={service.name}
						description={service.description}
						imageSrc={service.imageUrl}
						onClick={() => {
							// Navigate to service page
							window.location.href = `/service/${service.key}`
						}}
					/>
				)) : (
					<p>Loading top services...</p>
				)}
			</div>
		</section>
	)

	// #endregion

	return <>
		<div id='home-page' className='page'>
			{heroSection}
			{aboutSection}
			{topServiceSection}
		</div>
	</>
}

export default HomePage