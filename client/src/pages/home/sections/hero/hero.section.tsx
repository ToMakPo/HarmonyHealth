import { useEffect, useState } from 'react'

import heroImage from '../../assets/images/monstera_deliciosa.jpg'
import logo from '../../assets/images/logo/harmony_logo_gold.png'

import './hero.styles.scss'

function HeroSection() {
	const taglineText = ['Health', 'Life', 'Wellness', 'Happiness', 'Mind', 'Body', 'Spirit']
	const [taglineIndex, setTaglineIndex] = useState(0)
	const [subIndex, setSubIndex] = useState(0)
	const [isDeleting, setIsDeleting] = useState(false)

	// Dynamic typing speed variables
	const typingSpeed = 150 // Speed of typing each char
	const deletingSpeed = 75 // Speed of deleting each char
	const pauseDuration = 2000 // Time the full word stays on screen

	useEffect(() => {
		// 1. If we have typed the whole word, pause, then switch to deleting mode
		if (!isDeleting && subIndex === taglineText[taglineIndex].length + 1) {
			const timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
			return () => clearTimeout(timeout)
		}

		// 2. If we deleted the whole word, switch to the next word index and stop deleting
		if (isDeleting && subIndex === 0) {
			setIsDeleting(false)
			setTaglineIndex(prev => (prev + 1) % taglineText.length)
			return
		}

		// 3. Increment or decrement subIndex to build the string character-by-character
		const timeout = setTimeout(() => setSubIndex(prev => prev + (isDeleting ? -1 : 1)), isDeleting ? deletingSpeed : typingSpeed)

		return () => clearTimeout(timeout)
	}, [subIndex, isDeleting, taglineIndex])

	// Slice the current word up to the animated character boundary index
	const displayedTagline = taglineText[taglineIndex].substring(0, subIndex)

	return (
		<section id='hero-section' style={{ backgroundImage: `url(${heroImage})` }}>
			<div className='hero-overlay'></div>

			<div id='hero-content'>
				<img id='hero-logo' src={logo} alt='Harmony Health Logo' />

				{/* The CSS class adds a blinking text cursor to complete the effect */}
				<div id='hero-tagline'>
					<span>Your Harmony</span>
					<span className='typewriter-text'>{'Your ' + displayedTagline}</span>
				</div>

				<button
					id='services-button'
					onClick={() => {
						const servicesSection = document.getElementById('services-section')
						if (servicesSection) {
							servicesSection.scrollIntoView({ behavior: 'smooth' })
						}
					}}
				>
					Explore Services
				</button>
			</div>
		</section>
	)
}

export default HeroSection
