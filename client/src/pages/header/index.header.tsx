import React, { useState } from 'react'
import { getImagePath } from '../../lib/utils'
import './header.styles.sass'

interface NavRoute {
	name: string
	href?: string
	subRoutes?: NavRoute[]
}

const HomeHeader: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false)

	const navRoutes: NavRoute[] = [
		{ name: 'Home', href: '#home' },
		{ name: 'About Us', href: '#about' },
		{ name: 'Services', href: '#services', subRoutes: [
			{ name: 'General Health', href: '#services-general' },
			{ name: 'Pediatrics', subRoutes: [
				{ name: 'Well Child Visits', href: '#services-pediatrics-well-child' },
				{ name: 'Immunizations', href: '#services-pediatrics-immunizations' },
				{ name: 'Developmental Screenings', href: '#services-pediatrics-developmental' },
			] },
			{ name: 'Adult Health', href: '#services-adult' },
		] },
	]

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const userData = {
		id: '1S56DSF6SDF',
		username: 'johndoe',
		firstName: 'John',
		lastName: 'Doe',
		title: 'Mr.',
		email: 'johndoe@example.com',
		phone: '5551234567',
		address: '123 Main St, Anytown, USA',
		gender: 'Male',
		dob: '1990-01-01',
		notes: 'No known allergies.',
		imagePath: null,
		status: 'Active'
	}

	const [user] = useState<typeof userData | null>(null)
	const [useName] = useState(true)

	const brandingEl = (
		<a href="#home" id="branding">
			<img id="logo" src={getImagePath('harmony-logo.svg')} alt="Harmony Health Logo" />
			<img id="title" src={getImagePath('harmony-title.svg')} alt="Harmony Health Title" />
		</a>
	)

	const buildNavRoutes = (routes: NavRoute[]) => {
		return (
			<ul>
				{routes.map((route, i) => (
					route.subRoutes ? (
						<li key={i} className="menu-item has-submenu">
							{route.href ? (<a href={route.href}>{route.name}</a>) : (<span>{route.name}</span>)}
							{buildNavRoutes(route.subRoutes)}
						</li>
					) : (
						<li key={i} className="menu-item">
							{route.href ? (<a href={route.href}>{route.name}</a>) : (<span>{route.name}</span>)}
						</li>
					)
				))}
			</ul>
		)
	}

	const navEl = (
		<nav id="site-navigation">
			{buildNavRoutes(navRoutes)}
		</nav>
	)

	const userProfileEl = user && (
		<div id="user-profile">
			{user.imagePath ? (
				<img id="user-image" className='profile-bubble' src={getImagePath(user.imagePath)} alt={`${user.firstName} ${user.lastName}`} />
			) : (
				<div id="user-initials" className='profile-bubble'>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</div>
			)}
			{useName ? (
				<span className="profile-name">{user.firstName} {user.lastName}</span>
			) : (
				<span className="profile-name">{user.username}</span>
			)}
		</div>
	)

	const actionEl = (
		<div id="header-actions">
			<a href="#book-appointment" className="button primary">Book Appointment</a>
			{user ? userProfileEl : <a href="#login" className="button">Login</a>}
		</div>
	)

	const mobileMenu = <div id={'mobile-container'} className={showMenu ? 'show' : ''}>
		<button id="show-mobile-menu-button" aria-label="Toggle Menu" onClick={() => {
			setShowMenu(true)
			console.log('showMenu', showMenu)
		}}>
			<span className="bar"></span>
			<span className="bar"></span>
			<span className="bar"></span>
		</button>

		<div id="mobile-menu">
			{navEl}
			{actionEl}

			<button type="button" className="menu-close-button" onClick={() => setShowMenu(false)} aria-label="Close modal">❌</button>
		</div>

		<div id="mobile-menu-backdrop" onClick={() => setShowMenu(false)}></div>
	</div>

    return <>
		<header className="site-header">
			{navEl}
			{brandingEl}
			{actionEl}
			{mobileMenu}
		</header>
	</>
}

export default HomeHeader