import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
	res.send('Service API is running')
})

export default router
