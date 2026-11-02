import { useLayoutEffect, useState, useRef } from 'react'

import { handleBooking } from '../../../../lib/bookings'

import './services.styles.scss'

/// IMAGES ///
import injectionImage from '../../../../assets/images/services/girl_getting_injection.jpg'
import ivTherapyImage from '../../../../assets/images/services/iv_therapy.png'
import glp1Image from '../../../../assets/images/services/semaglutide_and_tirzepatide.png'
import microneedlingImage from '../../../../assets/images/services/microneedling.png'
import exosomesImage from '../../../../assets/images/services/exosomes.png'

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
		imageUrl: microneedlingImage,
		service: 'Platelet-Rich%20Plasma%20(PRP)%20Therapy'
	},
	{
		title: 'Microneedling with Exosomes',
		description: `
            Rejuvenate your skin with microneedling and exosomes, a treatment designed to support collagen production, improve skin texture, soften fine lines and acne scars, and promote a smoother, brighter complexion.

            This combination helps refine enlarged pores, improve uneven skin tone, and support your skin's natural renewal process for a healthier, more radiant appearance.
        `,
		imageUrl: exosomesImage,
		service: 'Microneedling'
	}
]

const CARD_COUNT = services.length
const MAX_COLUMNS = 5
const CARD_WIDTH = 350
const GAP_SIZE = 24

function ServicesSection() {
	const cardsRef = useRef<HTMLDivElement>(null)
	const [colCount, setColCount] = useState<number>(1)

	useLayoutEffect(() => {
		if (!cardsRef.current) return

		const observer = new ResizeObserver(([entry]) => {
			const containerWidth = entry.contentRect.width
			const chosenCols = getColumns(containerWidth)

			setColCount(chosenCols)
		})

		observer.observe(cardsRef.current)
		return () => observer.disconnect()
	}, [])

	function createServiceCard(key: number, title: string, description: string, imageUrl: string) {
		const service = services[key].service

		// Math to identify items on the last row and compute shift amount
		const remainder = CARD_COUNT % colCount
		const emptySlots = remainder === 0 ? 0 : colCount - remainder
		const firstLastRowIndex = remainder === 0 ? CARD_COUNT : CARD_COUNT - remainder
		const isLastRow = key >= firstLastRowIndex

		const shiftX = isLastRow && emptySlots > 0 ? `calc(${emptySlots * 0.5} * (100% + var(--gap-size)))` : '0px'

		return (
			<div
				className='service-card'
				key={key}
				style={{ '--shift-x': shiftX } as React.CSSProperties}
				onClick={() => handleBooking(service)}
			>
				<img src={imageUrl} alt={title} />
				<h2>{title}</h2>
				{description
					.split('\n')
					.filter(line => line.trim() !== '')
					.map((line, index) => (
						<p key={index}>{line}</p>
					))}
			</div>
		)
	}

	return (
		<section id='services-section'>
			<div id='services-container' className='container'>
				<h1>Our Services</h1>

				<div
					id='services-section-cards'
					ref={cardsRef}
					style={
						{
							'--col-count': colCount,
							'--card-width': `${CARD_WIDTH / 16}rem`,
							'--gap-size': `${GAP_SIZE / 16}rem`,
							'--card-count': CARD_COUNT
						} as React.CSSProperties
					}
				>
					{services.map((service, i) => createServiceCard(i, service.title, service.description, service.imageUrl))}
				</div>
			</div>
		</section>
	)
}

export default ServicesSection

function getColumns(width: number): number {
	let colCount = Math.min(CARD_COUNT, Math.floor((width + GAP_SIZE) / (CARD_WIDTH + GAP_SIZE)), MAX_COLUMNS)

	while (colCount > 0) {
		if (CARD_COUNT === colCount) return CARD_COUNT

		const m = CARD_COUNT % colCount
		if (m === 0 || m === colCount - 1) return colCount

		colCount--
	}

	return 1
}
