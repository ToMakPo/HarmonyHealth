import { companyInfo } from '../../../../store/info'

import './map.styles.scss'

function MapSection() {
	// Join the address array into a single string
	const address = companyInfo.address
	const link =
		'https://www.google.com/maps/place/Harmony+Health+Wellness+Center/@47.9433702,-122.1113035,1022m/data=!3m2!1e3!4b1!4m6!3m5!1s0x549aa9ad9db92069:0xbde75f5c38bdee31!8m2!3d47.9433666!4d-122.1087286!16s%2Fg%2F11ntgtpys_?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D'

	const mapSrc =
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4450.9179985772935!2d-122.11130352255674!3d47.94337016466013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549aa9ad9db92069%3A0xbde75f5c38bdee31!2sHarmony%20Health%20Wellness%20Center!5e1!3m2!1sen!2sus!4v1793601570826!5m2!1sen!2sus'

	return (
		<section id='map-section'>
			<h1>Our Location</h1>

			<a id='map-address-link' href={link} target='_blank' rel='noopener noreferrer'>
				{address.map((line, index) => (
					<span key={index}>{line}</span>
				))}
			</a>
			<iframe src={mapSrc} allowFullScreen loading='lazy' referrerPolicy='strict-origin-when-cross-origin'></iframe>
		</section>
	)
}

export default MapSection
