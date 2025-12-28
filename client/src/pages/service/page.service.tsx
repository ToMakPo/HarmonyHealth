import { useParams } from "react-router-dom"
import ServiceInfo from "../../models/Service"

import './style.service.sass'
import { useEffect, useState } from "react"

interface ServicePageProps {
	serviceKey?: string
}

const ServicePage: React.FC<ServicePageProps> = (props) => {
	const params = useParams<keyof ServicePageProps>()
	const serviceKey = props.serviceKey || params.serviceKey || ''

	const [service, setService] = useState<ServiceInfo | null>(null)
	const [loading, setLoading] = useState(true)

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

	useEffect(() => {
		const fetchService = async () => {
			try {
				setLoading(true)
				const services = await ServiceInfo.find({ key: serviceKey })
				setService(services.length > 0 ? services[0] : null)
			} catch (error) {
				console.error('Error fetching service:', error)
				setService(null)
			} finally {
				setLoading(false)
			}
		}

		if (serviceKey) fetchService()
	}, [serviceKey])

	const bookAppointmentEl = (
		<section id="book-appointment" className="clamp-width">
			<div className="appointment-image">
				<img src={service?.imageUrl} alt={service?.name} />
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
	)

	return (
		<div id="service-page" className={`page ${service ? !loading ? `service-${service.key}` : 'loading' : 'not-found'}`}>
			{service && !loading ? (<>
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

			{service.details.toComponents()}

			{bookAppointmentEl}
			</>) : loading ? (
				<p>Loading service information...</p>
			) : (
				<p>Service not found. Please return to the <a href="/services">services page</a>.</p>
			)}
		</div>
	)
}

export default ServicePage;