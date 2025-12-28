import { Router } from 'express'

const router = Router()

import employeeApi from './api.employee'
import employeePreferenceApi from './api.employee-preference'
import customerApi from './api.customer'
import customerPreferenceApi from './api.customer-preference'
import serviceApi from './api.service'
import serviceProviderApi from './api.service-provider'
import appointmentApi from './api.appointment'
import appointmentNoteApi from './api.appointment-note'
import authApi from './api.auth'
import messagingApi from './api.messaging'


router.use('/employee', employeeApi)
router.use('/employee/preference', employeePreferenceApi)
router.use('/customer', customerApi)
router.use('/customer/preference', customerPreferenceApi)
router.use('/service', serviceApi)
router.use('/service/provider', serviceProviderApi)
router.use('/appointment', appointmentApi)
router.use('/appointment/note', appointmentNoteApi)
router.use('/auth', authApi)
router.use('/messaging', messagingApi)

export default router
