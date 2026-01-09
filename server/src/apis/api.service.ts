import { Router } from 'express'

import { apiResponse } from '../lib/apiResponse'
import { ModelError } from '../models/index.model'
import Service, { ServiceFilter } from '../models/model.service'

const router = Router()

router.get('/', async (req, res) => {
	const sender = 'API - Find Service' as const

	const filters = {} as ServiceFilter

	try {
		const response = await Service.find(filters)

		res.json(apiResponse(true, sender, 200, 'Services retrieved successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while retrieving services.'))
	}
})

router.post('/', async (req, res) => {
	const sender = 'API - Create Service' as const

	const data = req.body

	try {
		const response = await Service.insert(data)

		res.json(apiResponse(true, sender, 200, 'Service created successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while creating the service.'))
	}
})

router.put('/', async (req, res) => {
	const sender = 'API - Update Service' as const

	const { id, ...data } = req.body

	try {
		const response = await Service.update({ id }, data)

		res.json(apiResponse(true, sender, 200, 'Service updated successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while updating the service.'))
	}
})

router.delete('/', async (req, res) => {
	const sender = 'API - Delete Service' as const

	const { id } = req.body

	try {
		const response = await Service.delete({ id } as ServiceFilter)

		res.json(apiResponse(true, sender, 200, 'Service deleted successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while deleting the service.'))
	}
})

router.get('/validate', async (req, res) => {
	const sender = 'API - Validate Service' as const

	const data = req.query as Record<string, any>

	try {
		const response = await Service.validate(data)

		res.json(apiResponse(response.passed, sender, response.code + 100, response.message, { response: response.data }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while validating the service.'))
	}
})

export default router
