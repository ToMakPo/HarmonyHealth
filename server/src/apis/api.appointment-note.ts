import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
	res.send('Appointment Note API is running')
})

export default router
