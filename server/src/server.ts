import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import './database'

dotenv.config()

const PORT = process.env.PORT || 5000
const serverUrl = `${process.env.SERVER_URL || 'http://localhost:'}${PORT}`

const app = express()
app.disable('x-powered-by')
	.use(cors({ origin: JSON.parse(process.env.CORS_ORIGINS || '[]'), credentials: true }))
	.use(morgan('dev'))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(cookieParser())
	.use(express.static('public'))

// Routes
app.get('/', (req, res) => {
	res.send('Harmony Health server is running')
})

// Start server
app.listen(PORT, () => {
	console.log(`✔️  Server running: ${serverUrl}`)

	if (process.env.APP_DEBUG === 'true') {
		console.log('⚠️  Debug mode is enabled')
	}
})

