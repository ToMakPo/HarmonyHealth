import { getImagePath } from "../../lib/utils"

import "./styles.home.sass"

const HomePage: React.FC = () => {
	////////////////////
	/// HERO SECTION ///
	////////////////////
	// #region Hero Section

	const heroImageUrl = getImagePath('hero_image.png')
	const heroSection = (
		<section id="hero-section" 
		style={{backgroundImage: `url(${heroImageUrl})`}}
		>
			<div id="hero-overlay">
				<div id="hero-text">
					<span id="hero-title">
						<h2>Welcome to</h2>
						<h1>Harmony Health</h1>
					</span>
					<p>Your partner in achieving optimal health and wellness.</p>
					<button id="get-started-button">Get Started</button>
				</div>
			</div>
		</section>
	)

	// #endregion



	return <>
		<div id='home-page' className='page'>
			{heroSection}

			<h1>Welcome to Harmony Health</h1>
			<p>Your partner in achieving optimal health and wellness. At Harmony Health, we believe that true well-being comes from a balance of mind, body, and spirit. Our dedicated team of healthcare professionals is committed to providing personalized care tailored to your unique needs.</p>
			<p>Whether you're seeking preventive care, managing a chronic condition, or simply looking to enhance your overall health, Harmony Health is here to support you every step of the way. Join us on a journey towards a healthier, happier you.</p>
		</div>
	</>
}

export default HomePage