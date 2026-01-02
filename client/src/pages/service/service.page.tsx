import { useEffect, useMemo, useState } from "react"

import { scrollToAnchor } from "../../lib/utils"
import ServiceInfo from "../../models/Service"

import './service.style.sass'

const ServicePage: React.FC = () => {
	/** Scrolls to anchor if present in URL on initial load. */
	useEffect(scrollToAnchor, [])



	///////////////
	/// SERVICE ///
	///////////////
	// #region Service

	/** The service to be displayed on the page. */
	const [service, setService] = useState<ServiceInfo | null>(null)

	useEffect(() => {
		(async () => {
			const serviceKey = window.location.pathname.split('/').pop()

			if (serviceKey) {
				const service = await ServiceInfo.find({ key: serviceKey })

				if (service.length > 0) {
					setService(service[0])
					return
				}
			}
			
			setService(null)
		})()
	}, [])



	/////////////////
	/// RENDERING ///
	/////////////////
	// #region Rendering

	/** The hero section of the service page.
	 * 
	 * Displays the service name and description over a background image.
	 */
	const heroSection = useMemo(() => service && (
		<div className="page-hero"
			style={{
				backgroundImage: `url(${service.imageUrl})`
			}}
		>
			<div className="overlay">
				<h1>{service.name}</h1>
				<p>{service.description}</p>
			</div>
		</div>
	), [service])

	/** The details section of the service page. 
	 * 
	 * Displays detailed information about the service.
	 */
	const detailsSection = useMemo(() => service?.details.toComponents(), [service])

	/** The book appointment section of the service page.
	 * 
	 * Provides a call to action for users to book an appointment.
	 */
	const bookAppointmentEl = useMemo(() => service && (
		<section id="book-appointment" className="clamp-width">
			<div className="appointment-image">
				<img src={service.imageUrl} alt={service?.name} />
			</div>

			<div className="appointment-text">
				<h2>Schedule Your Appointment</h2>

				<p>
					Ready to take the next step? Book your appointment with us today
					and embark on your journey to better health and wellness.
				</p>

				<button className="book-now-button">Book Now</button>
			</div>
		</section>
	), [service])

	/** The "not found" element displayed when the service does not exist. */
	const notFoundEl = useMemo(() => !service && (
		<div id="service-not-found" className="clamp-width">
			<h2>Service Not Found</h2>

			<p>
				We're sorry, but the service you're looking for does not exist. Please
				check the URL or return to the <a href="/services">services page</a> to explore our offerings.
			</p>
		</div>
	), [service])

	return (
		<div id="service-page" className={`page service-${service?.key}`}>
			{heroSection}
			{detailsSection}
			{bookAppointmentEl}

			{notFoundEl}
		</div>
	)
}

export default ServicePage