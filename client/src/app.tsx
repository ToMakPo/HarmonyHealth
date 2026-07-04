import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LightDarkToggle from './components/light-dark/light-dark.component'

function App() {
	return (
		<BrowserRouter>
			<LightDarkToggle />
		</BrowserRouter>
	)
}

export default App
