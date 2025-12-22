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

	return !loading && service ? (
		<div className={`service-page page service-${service.key}`}>
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

			<section className="book-appointment">
				<img src={service.imageUrl} alt={service.name} />

				<div className="appointment-text">
					<h2>Schedule Your Appointment</h2>

					<p>
						Ready to take the next step? Book your appointment with us today 
						and embark on your journey to better health and wellness.
					</p>

					<button className="book-now-button">Book Now</button>
				</div>
			</section>
		</div>
	) : (
		<div className="service-page loading">
			<p>Loading service information...</p>
		</div>
	)
}

export default ServicePage;