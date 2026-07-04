import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageHeader from './layout/header/header.layout'
import HomePage from './pages/home/home.page'
import LightDarkToggle from './components/light-dark/light-dark.component'

function App() {
	return (
		<BrowserRouter>
			<PageHeader />
			<LightDarkToggle />

			<Routes>
				<Route path='/' element={<HomePage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
