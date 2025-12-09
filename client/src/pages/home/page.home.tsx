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



	/////////////////////
	/// ABOUT SECTION ///
	/////////////////////
	// #region About Section

	const aboutSection = (
		<section id="about-section">
			<h2>About Harmony Health</h2>
			<p>At Harmony Health, we believe that true well-being comes from a balance of mind, body, and spirit. Our dedicated team of healthcare professionals is committed to providing personalized care tailored to your unique needs.</p>
			<p>Whether you're seeking preventive care, managing a chronic condition, or simply looking to enhance your overall health, Harmony Health is here to support you every step of the way. Join us on a journey towards a healthier, happier you.</p>
		</section>
	)

	// #endregion


	///////////////////////////
	/// TOP SERVICE SECTION ///
	///////////////////////////
	// #region Top Service Section

	// const topService 

	const topServiceSection = (
		<section id="top-service-section">
			<h2>Our Top Services</h2>
			<div id="service-cards-container">
				<div className="service-card">
					<h3>General Health Check-ups</h3>
					<p>Comprehensive health assessments to keep you in optimal condition.</p>
				</div>
				<div className="service-card">
					<h3>Specialized Medical Consultations</h3>
					<p>Expert advice and treatment plans from our team of specialists.</p>
				</div>
				<div className="service-card">
					<h3>Wellness Programs</h3>
					<p>Personalized programs designed to enhance your overall well-being.</p>
				</div>
			</div>
		</section>
	)

	// #endregion

	return <>
		<div id='home-page' className='page'>
			{heroSection}
			{aboutSection}
			{topServiceSection}
		</div>
	</>
}

export default HomePage