import { Router } from 'express'

import { apiResponse } from '../lib/apiResponse'
import { ModelError } from '../models/index.model'
import Location, { LocationFilter } from '../models/model.location'

const router = Router()

router.get('/', async (req, res) => {
	const sender = 'API - Find Location' as const

	const filters = {} as LocationFilter

	try {
		const response = await Location.find(filters)

		res.json(apiResponse(true, sender, 200, 'Locations retrieved successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while retrieving locations.'))
	}
})

router.post('/', async (req, res) => {
	const sender = 'API - Create Location' as const

	const data = req.body

	try {
		const response = await Location.insert(data)

		res.json(apiResponse(true, sender, 200, 'Location created successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while creating the location.'))
	}
})

router.put('/', async (req, res) => {
	const sender = 'API - Update Location' as const

	const { id, ...data } = req.body

	try {
		const response = await Location.update({ id }, data)

		res.json(apiResponse(true, sender, 200, 'Location updated successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while updating the location.'))
	}
})

router.delete('/', async (req, res) => {
	const sender = 'API - Delete Location' as const

	const { id } = req.body

	try {
		const response = await Location.delete({ id } as LocationFilter)

		res.json(apiResponse(true, sender, 200, 'Location deleted successfully.', { response }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while deleting the location.'))
	}
})

router.get('/validate', async (req, res) => {
	const sender = 'API - Validate Location' as const

	const data = req.query as Record<string, any>

	try {
		const response = await Location.validate(data)

		res.json(apiResponse(response.passed, sender, response.code + 100, response.message, { response: response.data }))
	} catch (error) {
		error instanceof ModelError
			? res.json(apiResponse(false, sender, error.code + 100, error.message, error.data))
			: res.json(apiResponse(false, sender, 400, 'An unexpected error occurred while validating the location.'))
	}
})

export default router
