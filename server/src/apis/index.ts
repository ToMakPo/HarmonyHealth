import { Router } from 'express'

const router = Router()

import serviceApi from './api.service'
import locationApi from './api.location'

router.use('/service', serviceApi)
router.use('/location', locationApi)

export default router
