import injectionImage from '../../assets/images/girl_getting_injection.jpg'
import ivTherapyImage from '../../assets/images/iv_therapy.png'
import glp1Image from '../../assets/images/semaglutide_and_tirzepatide.png'

import './services.styles.scss'

function ServicesPage() {
	const services = [
		{
			title: 'Injectable Treatments',
			description:
				'Non-surgical aesthetic procedures aimed at softening expression lines, restoring facial volume, and refining contours. Including neuromodulators such as Botox®, Dysport®, and Daxxify®, along with dermal fillers, Sculptra®, and Platelet-Rich Plasma (PRP) options for facial rejuvenation, under-eye revitalization, and hair restoration.',
			imageUrl: injectionImage
		},
		{
			title: 'IV & Wellness Therapy',
			description:
				'Targeted nutrient and vitamin infusions created to nourish the body, support cellular function, and boost overall vitality. Available treatments feature NAD+ therapy, customized wellness blends like the Youth & Vitality and Immune Support IV infusions, and direct B-complex vitamin injections.',
			imageUrl: ivTherapyImage
		},
		{
			title: 'Medical Weight Loss',
			description:
				"An individualized medical management program centered around sustainable lifestyle changes, expert nutritional guidance, and continuous clinical support. Plans are tailored to each patient's goals and include targeted medication options, such as semaglutide (GLP-1) and tirzepatide (GLP-1 + GIP) therapies, when appropriate.",
			imageUrl: glp1Image
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
			<div id='services-container'>
				<h1>Our Services</h1>

				<div id='services-page-cards'>
					{services.map((service, i) => createServiceCard(i, service.title, service.description, service.imageUrl))}
				</div>
			</div>
		</section>
	)
}

export default ServicesPage
