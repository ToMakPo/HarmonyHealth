import { handleBooking } from '../../../../lib/bookings'
import injectionImage from '../../../../assets/images/girl_getting_injection.jpg'
import ivTherapyImage from '../../../../assets/images/iv_therapy.png'
import glp1Image from '../../../../assets/images/semaglutide_and_tirzepatide.png'
import prpImage from '../../../../assets/images/prp_treatment.jpg'

import './services.styles.scss'

function ServicesSection() {
	const services = [
		{
			title: 'Injectable Treatments',
			description:
				'Non-surgical aesthetic procedures aimed at softening expression lines, restoring facial volume, and refining contours. Including neuromodulators such as Botox®, Dysport®, and Daxxify®, along with dermal fillers, Sculptra®, and Platelet-Rich Plasma (PRP) options for facial rejuvenation, under-eye revitalization, and hair restoration.',
			imageUrl: injectionImage,
			service: 'Injectables'
		},
		{
			title: 'IV & Wellness Therapy',
			description:
				'Targeted nutrient and vitamin infusions created to nourish the body, support cellular function, and boost overall vitality. Available treatments feature NAD+ therapy, customized wellness blends like the Youth & Vitality and Immune Support IV infusions, and direct B-complex vitamin injections.',
			imageUrl: ivTherapyImage,
			service: 'IV%20Therapy'
		},
		{
			title: 'Medical Weight Loss',
			description:
				"An individualized medical management program centered around sustainable lifestyle changes, expert nutritional guidance, and continuous clinical support. Plans are tailored to each patient's goals and include targeted medication options, such as semaglutide (GLP-1) and tirzepatide (GLP-1 + GIP) therapies, when appropriate.",
			imageUrl: glp1Image,
			service: 'Wellness'
		},
		{
			title: 'PRP Treatments',
			description:
				'Revitalize your skin and hair using the healing power of your own biology. Our specialized Platelet-Rich Plasma (PRP) therapies utilize concentrated growth factors from your blood to stimulate deep cellular renewal. Whether you choose a microneedling PRP facial to restore radiant skin texture, a targeted under-eye treatment to smooth and refresh tired eyes, or hair restoration injections to stimulate natural growth and thickness, each treatment triggers your biological systems to repair tissue and support collagen growth.',
			imageUrl: prpImage,
			service: 'Platelet-Rich%20Plasma%20(PRP)%20Therapy'
		}
	]

	function createServiceCard(key: number, title: string, description: string, imageUrl: string) {
		const service = services[key].service

		return (
			<div className='service-card' key={key} onClick={() => handleBooking(service)}>
				<img src={imageUrl} alt={title} />
				<h2>{title}</h2>
				<p>{description}</p>
			</div>
		)
	}

	return (
		<section id='services-section'>
			<div id='services-container'>
				<h1>Our Services</h1>

				<div id='services-section-cards'>
					{services.map((service, i) => createServiceCard(i, service.title, service.description, service.imageUrl))}
				</div>
			</div>
		</section>
	)
}

export default ServicesSection
