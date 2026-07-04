import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageHeader from './layout/header/header.layout'
import HomePage from './pages/home/home.page'
import LightDarkToggle from './components/light-dark/light-dark.component'

export function scrollToHashElement({ id }: { id: string }) {
	const element = document.getElementById(id)
	if (element) element.scrollIntoView({ behavior: 'smooth' })
}

function App() {
	return (
		<BrowserRouter>
			<PageHeader />

			<Routes>
				<Route path='/' element={<HomePage />} />
			</Routes>

			<LightDarkToggle />
		</BrowserRouter>
	)
}

export default App
