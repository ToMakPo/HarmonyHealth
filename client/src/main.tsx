import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app'

import './index.scss'
import 'material-symbols/index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
