import { companyInfo } from '../../store/info'

import './map.styles.scss'

function MapPage() {
	// Join the address array into a single string
	const address = companyInfo.address
	const link =
		'https://www.google.com/maps/place/Harmony+Health+Wellness+Center/data=!4m2!3m1!1s0x549aa9ad9db92069:0xbde75f5c38bdee31?hl=en&trk=https%3A%2F%2Fc.gle%2FAKMee0d_VorV_gO7WTIdVrhXPWflJclgzs8AIASjV3O2vO7G-i2EmUuMkNtiRtudTMBQpjy8QwBOmz7srLO_aIwGcz4TSEgKpx_rMUugjyuspmmmrvKuut_98vulGt85'

	const mapSrc =
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d668.159734039164!2d-122.10937233028244!3d47.943367496560334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549aa9816ba4c7c1%3A0xb689a7687e8809fc!2s2707%20Bickford%20Ave%20Unit%20B%2C%20Snohomish%2C%20WA%2098290!5e0!3m2!1sen!2sus!4v1785105890305!5m2!1sen!2sus'

	return (
		<div id='map-page'>
			<h1>Our Location</h1>

			<a id='map-address-link' href={link} target='_blank' rel='noopener noreferrer'>
				{address.map((line, index) => (
					<span key={index}>{line}</span>
				))}
			</a>
			<iframe src={mapSrc} allowFullScreen loading='lazy' referrerPolicy='strict-origin-when-cross-origin'></iframe>
		</div>
	)
}

export default MapPage
