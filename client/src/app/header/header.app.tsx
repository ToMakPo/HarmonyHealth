import React, { useMemo, useState } from 'react'

import './header.styles.sass'

/** Whether to show the user's full name or username in the profile section. 
 * 
 * If `true`, shows full name; if `false`, shows username.
 */
const USE_NAME = true

/** A navigation route for the header menu. */
type NavRoute = {
	/** The name of the navigation route will be used as the link text. */
	name: string
	/** The path of the navigation route used for the URL. */
	path: string
	/** An optional anchor to scroll to on the page. */
	anchor?: string
} | {
	/** The name of the navigation route will be used as the link text. */
	name: string
	/** An array of sub-routes for nested navigation menus. */
	subRoutes: NavRoute[]
	/** An optional navigation path. If provided, the navigation button be clickable. */
	path?: string
	/** An optional anchor to scroll to on the page if path is provided. */
	anchor?: string
}

/** A list of navigation routes for the header navigation menu. 
 * 
 * TODO: Load Services dynamically.
 */
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
			{ name: 'Adult Health', path: 'services-adult' }
		]
	}
]

/** Fake user data for development purposes.
 * 
 * TODO: Replace with real user data
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userData = {
	id: '1S56DSF6SDF',
	username: 'johndoe',
	firstName: 'John',
	lastName: 'Doe',
	title: 'Mr.',
	email: 'johndoe@example.com',
	phone: '5551234567',
	address: '123 Fake St, Anytown, USA',
	gender: 'Male',
	dob: '1990-01-01',
	notes: 'No known allergies.',
	imagePath: null,
	status: 'Active'
}

/** Get URL from nav route.
 * 
 * This constructs the URL based on the path and anchor of the nav route. You can
 * pass in the nav route object and it will return the full URL string.
 * 
 * @param nav A NavRoute object with name, path, and optional anchor.
 * @returns The constructed URL string.
 * 
 * @example 
 * ```
 * getUrl({ name: 'Services', path: '/services', anchor: 'all-service-cards' })
 * // >>> /services#all-service-cards
 * ```
 */
const getUrl = (nav: NavRoute) => {
    const path = nav.path ? `/${nav.path.replace(/^\/+/g, '').replace(/\/+$/g, '')}` : '/'
    const anchor = nav.anchor ? `#${nav.anchor}` : ''
    return `${path}${anchor}`
}

/** Handle navigation link click.
 * 
 * @param e The click event.
 * @param nav The NavRoute object.
 */
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

/** The main header component for the application. */
const HomeHeader: React.FC = () => {
	/** Whether the mobile menu is shown.
	 * 
	 * Only used for mobile viewports.
	 */
	const [showMenu, setShowMenu] = useState(false)

	/** The current logged-in user.
	 * 
	 * If no user is logged in, this will be `null`.
	 */
	const user = useMemo<typeof userData | null>(() => null, [])


	const brandingEl = useMemo(() => (
		<a href={getUrl({ name: 'Home', path: '' })} id="branding">
			<img id="logo" src={'/images/app/harmony-logo.svg'} alt="Harmony Health Logo" />
		</a>
	), [])

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
				<img id="user-image" className='profile-bubble' src={'/images/' + user.imagePath} alt={`${user.firstName} ${user.lastName}`} />
			) : (
				<div id="user-initials" className='profile-bubble'>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</div>
			)}
			
			<span className="profile-name">{USE_NAME ? user.firstName + ' ' + user.lastName : user.username}</span>
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