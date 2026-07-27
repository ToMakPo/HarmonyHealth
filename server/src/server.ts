import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import apiRoutes from './apis/index'

const PORT = process.env.PORT || 5000
const serverUrl = `${process.env.SERVER_URL || 'http://localhost:'}${PORT}`
const app = express()

app.disable('x-powered-by')
	.use(cors({ origin: JSON.parse(process.env.CORS_ORIGINS || '[]'), credentials: true }))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(express.static('public'))

// Routes
app.get('/', (req, res) => {
	res.send('Harmony Health server is running')
})

app.use('/api', apiRoutes)

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running: ${serverUrl}`)
	if (process.env.APP_DEBUG === 'true') {
		console.log('⚠️ Debug mode is enabled')
	}
})
