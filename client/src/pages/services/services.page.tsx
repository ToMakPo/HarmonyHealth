import injectionImage from '../../assets/images/girl_getting_injection.jpg'
import lazerTreatmentImage from '../../assets/images/girl_getting_lazer.jpg'
import bodyContouringImage from '../../assets/images/slim_body.jpg'

import './services.styles.scss'

function ServicesPage() {
	const services = [
		{
			title: 'Injectables & Facial Enhancements',
			description:
				'Botox and dermal fillers designed to smooth, restore, and enhance natural facial features with subtle, balanced results that enhance your natural beauty.',
			imageUrl: injectionImage
		},
		{
			title: 'Advanced Skin Treatments',
			description:
				'Microneedling, facials, and laser treatments for skin rejuvenation, improved texture, and a radiant, healthy glow that reveals your skin’s true potential.',
			imageUrl: lazerTreatmentImage
		},
		{
			title: 'Body Contouring & Wellness',
			description:
				'Non-invasive body contouring and rejuvenation services that support overall wellness, confidence, and long-term results for a more sculpted, youthful appearance.',
			imageUrl: bodyContouringImage
		}
	]

	function createServiceCard(key: number, title: string, description: string, imageUrl: string) {
		return (
			<div className='service-card' key={key}>
				<img src={imageUrl} alt={title} />
				<h2>{title}</h2>
				<p>{description}</p>
			</div>
		)
	}

	return (
		<section id='services-page'>
			<h1>Our Services</h1>

			<div id='services-page-cards'>
				{services.map((service, i) => createServiceCard(i, service.title, service.description, service.imageUrl))}
			</div>
		</section>
	)
}

export default ServicesPage
