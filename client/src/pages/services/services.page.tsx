import { useEffect, useMemo, useState } from "react"

import { scrollToAnchor } from "../../lib/utils"
import ServiceInfo from "../../models/model.service"
import ServiceCard from "../../components/service-card/service-card.component"

import './services.style.sass'

const ServicesPage: React.FC = () => {
	/** Scrolls to anchor if present in URL on initial load. */
	useEffect(scrollToAnchor, [])



	/////////////////////
	/// SERVICE CARDS ///
	/////////////////////
	// #region Service Cards

	const [services, setServices] = useState<ServiceInfo[]>([])

	useEffect(() => {
		const fetchServices = async () => {
			// Fetch all services from the API.
			const services = await ServiceInfo.find()

			setServices(services)
		}

		fetchServices()
	}, [])

	/** The section containing all service cards. 
	 * 
	 * Displays a card for each available service.
	 */
	const serviceCardsSection = useMemo(() => (
		<div id="service-cards">
			{services.map((service) => <ServiceCard key={service.key} service={service} />)}
		</div>
	), [services])


	
	/////////////////
	/// RENDERING ///
	/////////////////
	// #region Rendering

	return (
		<div id="services-page" className="page clamp-width">
			<h1>Our Services</h1>

			<p>
				At Harmony Health, we offer a wide range of healthcare services to meet your needs. Explore our services below to learn more
				about how we can help you achieve optimal health and wellness.
			</p>

			{serviceCardsSection}
		</div>
	)
}

export default ServicesPage