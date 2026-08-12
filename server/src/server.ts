import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import apiRoutes from './apis/index'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000
const serverUrl = `${process.env.SERVER_URL || 'http://localhost:'}${PORT}`

const app = express()

const getOrigins = (): string[] | string => {
	const raw = process.env.CORS_ORIGINS
	if (!raw) return []
	try {
		return JSON.parse(raw)
	} catch {
		// If cPanel stripped the quotes, manually clean and split the raw string
		return raw
			.replace(/[\[\]"]/g, '')
			.split(',')
			.map(url => url.trim())
	}
}

// Update your middleware line to use the new function:
app.disable('x-powered-by')
	.use(cors({ origin: getOrigins(), credentials: true }))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(express.static(path.join(__dirname, 'dist')))

app.use('/api', apiRoutes)

app.get('/api/test', (req, res) => {
	res.json({ passed: true, message: 'API is running' })
})

// Serves the index.html out of that same nested directory
app.get('/*any', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start server
app.listen(PORT, () => {
	console.info(`🚀 Server running: ${serverUrl}`)
	if (process.env.APP_DEBUG === 'true') {
		console.info('⚠️ Debug mode is enabled')
	}
})
