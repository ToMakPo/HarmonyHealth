import React, { useState } from 'react'
import { getImagePath } from '../../lib/utils'
import './styles.header.sass'

type NavRoute = {
	name: string
	path: string
	anchor?: string
} | {
	name: string
	path?: string
	anchor?: string
	subRoutes: NavRoute[]
}

const navRoutes: NavRoute[] = [
	{ name: 'Home', path: '/' },
	{ name: 'About Us', path: '/', anchor: 'about-section' },
	{
		name: 'Services', path: '/services', subRoutes: [
			{ name: 'General Health', path: '/services-general' },
			{
				name: 'Pediatrics', subRoutes: [
					{ name: 'Well Child Visits', path: '/services-pediatrics-well-child' },
					{ name: 'Immunizations', path: '/services-pediatrics-immunizations' },
					{ name: 'Developmental Screenings', path: '/services-pediatrics-developmental' },
				]
			},
			{ name: 'Adult Health', path: 'services-adult' },
		]
	},
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

const getUrl = (nav: NavRoute) => {
    const path = nav.path ? `/${nav.path.replace(/^\/+/g, '').replace(/\/+$/g, '')}` : '/'
    const anchor = nav.anchor ? `#${nav.anchor}` : ''
    return `${path}${anchor}`
}

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, nav: NavRoute) => {
    const currentPath = window.location.pathname
    const targetPath = nav.path ? `/${nav.path.replace(/^\/+/g, '').replace(/\/+$/g, '')}` : '/'
    
    // If we're on the same page
    if (currentPath === targetPath) {
        e.preventDefault()
        
        if (nav.anchor) {
            // Scroll to anchor section
            const element = document.querySelector(`#${nav.anchor}`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.pushState(null, '', `${currentPath}#${nav.anchor}`)
            }
        } else {
            // Scroll to top of page - need to scroll the main element
            const mainElement = document.querySelector('main')
            if (mainElement) {
                mainElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }
            // Remove hash from URL
            window.history.pushState(null, '', currentPath)
        }
    }
    // Otherwise let the default navigation happen
}

const HomeHeader: React.FC = () => {
	const [showMenu, setShowMenu] = useState(false)

	const [user] = useState<typeof userData | null>(null)
	const [useName] = useState(true)

	const brandingEl = (
		<a href={getUrl({ name: 'Home', path: '' })} id="branding">
			<img id="logo" src={getImagePath('harmony-logo.svg')} alt="Harmony Health Logo" />
			<img id="title" src={getImagePath('harmony-title.svg')} alt="Harmony Health Title" />
		</a>
	)

	const buildNavRoutes = (navRoutes: NavRoute[]) => {
		return (
			<ul>
				{navRoutes.map((nav, i) => (
					<li key={i} className={["menu-item", 'subRoutes' in nav ? 'has-submenu' : ''].filter(Boolean).join(' ')}>
						{nav.path != null ? (<a href={getUrl(nav)} onClick={(e) => handleNavClick(e, nav)}>{nav.name}</a>) : (<span>{nav.name}</span>)}
						{'subRoutes' in nav && buildNavRoutes(nav.subRoutes)}
					</li>
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
		<header className="app-header">
			{navEl}
			{brandingEl}
			{actionEl}
			{mobileMenu}
		</header>
	</>
}

export default HomeHeader