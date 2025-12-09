import { Router } from 'express'
import { apiResponse } from '../lib/apiResponse'

const router = Router()

router.get('/', (req, res) => {
	res.send('Auth API is running')
})

router.get('/session', (req, res) => {
	res.json(apiResponse(400, 'API_AUTH_SESSION', false, 'Not implemented'))
})

export default router
