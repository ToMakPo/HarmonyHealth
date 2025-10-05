import { Router } from 'express'

const router = Router()

import employeeApi from './api.employee'
import employeePreferenceApi from './api.employee-preference'
import customerApi from './api.customer'
import customerPreferenceApi from './api.customer-preference'
import serviceApi from './api.service'
import serviceGroupApi from './api.service-group'
import serviceProviderApi from './api.service-provider'
import appointmentApi from './api.appointment'
import appointmentNoteApi from './api.appointment-note'

router.use('/employee', employeeApi)
router.use('/employee/preference', employeePreferenceApi)
router.use('/customer', customerApi)
router.use('/customer/preference', customerPreferenceApi)
router.use('/service', serviceApi)
router.use('/service/group', serviceGroupApi)
router.use('/service/provider', serviceProviderApi)
router.use('/appointment', appointmentApi)
router.use('/appointment/note', appointmentNoteApi)

export default router
