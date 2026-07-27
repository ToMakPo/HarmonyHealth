import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import PageHeader from './layout/header/header.layout'
import HomePage from './pages/home/home.page'
import PrivacyPolicyPage from './pages/privacy/privacy-policy.page'
import LightDarkToggle from './components/light-dark/light-dark.component'
import useBreakpoint from './store/breakpoint'
import { useEffect } from 'react'

export function scrollToHashElement(ref: string, id?: string, navigate?: any) {
	// If moving to a different page route, let the React Router handle it cleanly.
	if (window.location.pathname !== ref && navigate) {
		navigate(ref, { state: { scrollToId: id } })
		return
	}

	// If already on the matching layout, perform a smooth view alignment jump.
	if (id) {
		const element = document.getElementById(id)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
	}
}

function CrossPageScrollHandler() {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const targetId = location.state?.scrollToId
		if (!targetId) return

		let tries = 0
		let intervalId: number

		const attemptScroll = () => {
			const element = document.getElementById(targetId)

			if (element) {
				element.scrollIntoView({ behavior: 'smooth' })
				clearInterval(intervalId)

				// FIX: Clean state tokens natively via React Router to prevent infinite render/refresh loops
				navigate(location.pathname, { replace: true, state: {} })
			} else {
				tries++
				if (tries >= 20) clearInterval(intervalId)
			}
		}

		intervalId = window.setInterval(attemptScroll, 100)

		return () => clearInterval(intervalId)
	}, [location, navigate])

	return null
}

function App() {
	const currentBreakpoint = useBreakpoint(state => state.currentBreakpoint)

	useEffect(() => {
		document.body.setAttribute('data-breakpoint', currentBreakpoint)
	}, [currentBreakpoint])

	return (
		<BrowserRouter>
			<CrossPageScrollHandler />
			<PageHeader />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
			</Routes>
			<LightDarkToggle />
		</BrowserRouter>
	)
}

export default App
