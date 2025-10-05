import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
	res.send('Appointment API is running')
})

export default router
