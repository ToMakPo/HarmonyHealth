import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageHeader from './layout/header/header.layout'
import LightDarkToggle from './components/light-dark/light-dark.component'

function App() {
	return (
		<BrowserRouter>
			<PageHeader />
			<LightDarkToggle />
		</BrowserRouter>
	)
}

export default App
