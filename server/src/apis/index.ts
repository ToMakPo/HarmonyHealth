import { Router } from 'express'

import messagingApi from './api.messaging'

const router = Router()

// import serviceApi from './api.service'
// import locationApi from './api.location'

// router.use('/service', serviceApi)
// router.use('/location', locationApi)
router.use('/messaging', messagingApi)

export default router
