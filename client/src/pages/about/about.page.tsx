import './about.styles.scss'

import aboutUsImage from '../../assets/images/about_us_image.jpg'

function AboutPage() {
	return (
		<section id='about-page'>
			<div id='about-page-image'>
				<img src={aboutUsImage} alt='About Us' />
			</div>

			<div id='about-page-text'>
				<h1>
					About <span>Harmony Health</span>
					<span>Wellness Center</span>
				</h1>
				<p>
					Harmony Health Wellness Center is dedicated to helping clients look and feel their best through a thoughtful balance of
					health, beauty, and advanced aesthetic care. We specialize in delivering natural-looking results through a personalized
					approach, combining modern techniques with a comfortable, welcoming environment. Our mission is to enhance confidence and
					overall wellness through safe, effective, and customized treatments tailored to each individual.
				</p>
				<p>
					At Harmony Health, we prioritize client education and individualized care, creating an elevated yet approachable experience
					where every client feels confident, informed, and cared for. Our team of experienced professionals is committed to
					supporting your long-term skin health and overall vitality, ensuring that each treatment is designed to complement your
					unique goals and lifestyle.
				</p>
			</div>
		</section>
	)
}

export default AboutPage
