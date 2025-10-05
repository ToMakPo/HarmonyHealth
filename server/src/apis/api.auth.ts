import { Router } from 'express'
import { apiResponse } from '../lib/response'

const router = Router()

router.get('/', (req, res) => {
	res.send('Auth API is running')
})

router.get('/session', (req, res) => {
	res.json(apiResponse(1, 'API_AUTH_SESSION', true, 'User session retrieved successfully', { userId: 123 }))
})

export default router
