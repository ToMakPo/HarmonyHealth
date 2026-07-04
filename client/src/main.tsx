import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/material-symbols-outlined/index.css'

import App from './app'

import './index.scss'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
