import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
	res.send('Customer Preference API is running')
})

export default router
