import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import PageHeader from './layout/header/header.layout'
import HomePage from './pages/home/home.page'
import LightDarkToggle from './components/light-dark/light-dark.component'
import { useEffect } from 'react'

function App() {
	return (
		<BrowserRouter>
			{/* Keeps active tracking of internal window location */}
			<ScrollToHashElement pageId='home-page' />

			<PageHeader />

			<Routes>
				<Route path='/' element={<HomePage />} />
			</Routes>

			<LightDarkToggle />
		</BrowserRouter>
	)
}

export default App

function ScrollToHashElement({ pageId }: { pageId: string }) {
	const { hash } = useLocation()

	useEffect(() => {
		const scrollContainer = document.getElementById(pageId)
		if (!scrollContainer) return

		if (hash) {
			const targetId = hash.replace('#', '')
			const targetElement = document.getElementById(targetId)

			if (targetElement) {
				// 1. Get the list of all direct section children inside the scroller
				const sections = Array.from(scrollContainer.children)

				// 2. Find where our target section sits in the stack layout order
				const sectionIndex = sections.findIndex(el => el.id === targetId)

				if (sectionIndex !== -1) {
					// 3. Multiply its index position by the container's exact available pixel height
					const targetScrollTop = sectionIndex * scrollContainer.clientHeight

					scrollContainer.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
				}
			}
		} else {
			scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [hash, pageId])

	return null
}
