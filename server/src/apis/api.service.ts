import { Router } from 'express'
import Service from '../models/Service'
import { ApiResponse } from '../lib/apiResponse'

const router = Router()

/**
 * Gets a list of services based on query parameters.
 * 
 * GET /api/service
 * 
 * Query Parameters:
 * - `id`: string | string[] - Unique identifier(s) of the service
 * - `name`: string - Name of the service (to match partially, case-insensitive)
 * - `description`: string - Description of the service (to match partially, case-insensitive)
 * - `details`: string - Details of the service (to match partially, case-insensitive)
 * - `topService`: boolean - Whether the service is a top service
 * - `package_id`: string | string[] - Unique identifier(s) of the package
 * - `package_name`: string - Name of the package (to match partially, case-insensitive)
 * - `package_description`: string - Description of the package (to match partially, case-insensitive)
 * - `package_cost`: number - Exact cost of the package
 * - `package_minCost`: number - Minimum cost of the package if no exact cost is provided
 * - `package_maxCost`: number - Maximum cost of the package if no exact cost is provided
 * - `package_price`: number - Price of the package (to match partially, case-insensitive)
 * - `package_minPrice`: number - Minimum price of the package if no exact price is provided
 * - `package_maxPrice`: number - Maximum price of the package if no exact price is provided
 * - `package_duration`: number - Exact duration of the package in minutes
 * - `package_minDuration`: number - Minimum duration of the package in minutes if no exact duration is provided
 * - `package_maxDuration`: number - Maximum duration of the package in minutes if no exact duration is provided
 * - returnApiResponse: boolean - Whether to return the services or an ApiResponse
 */
router.get('/', async (req, res) => {
	console.log('GET /api/service called with query:', req.query)

	const filters = {
		id: (req.query.id as string | undefined)?.split(','),
		name: req.query.name as string | undefined,
		description: req.query.description as string | undefined,
		details: req.query.details as string | undefined,
		topService: req.query.topService as boolean | undefined,
		package_id: (req.query.package_id as string | undefined)?.split(','),
		package_name: req.query.package_name as string | undefined,
		package_description: req.query.package_description as string | undefined,
		package_cost: req.query.package_cost as number | undefined,
		package_minCost: req.query.package_minCost as number | undefined,
		package_maxCost: req.query.package_maxCost as number | undefined,
		package_price: req.query.package_price as number | undefined,
		package_minPrice: req.query.package_minPrice as number | undefined,
		package_maxPrice: req.query.package_maxPrice as number | undefined,
		package_duration: req.query.package_duration as number | undefined,
		package_minDuration: req.query.package_minDuration as number | undefined,
		package_maxDuration: req.query.package_maxDuration as number | undefined,
	} as Record<string, any>
	const returnApiResponse = req.query.returnApiResponse as boolean | undefined || true

	const response = await Service.find(filters, returnApiResponse) as ApiResponse
	res.json(response)
})

/**
 * Creates a new service with the provided data.
 * 
 * POST /api/service
 * 
 * Request Body:
 * - id: string - The unique identifier for the service. (Optional, will be auto-generated if not provided)
 * - name: string - The name of the service.
 * - description: string - The description of the service.
 * - details: string - The details of the service.
 * - sortOrder: number - The sort order of the service.
 * - topService: boolean - Whether the service is a top service.
 * - packages: Package[] - The packages associated with the service.
 * > - id: string - The unique identifier for the package. (Optional, will be auto-generated if not provided)
 * > - name: string - The unique identifier for the package.
 * > - description: string - The description of the package.
 * > - cost: number - The approximate cost of the package to the provider. 
 * > - price: number - The price charged to the customer for the package.
 * > - duration: number - The duration of the package in minutes.
 * - returnApiResponse: boolean - Whether to return a boolean or an ApiResponse.
 * 
 * Response:
 * - ApiResponse indicating success or failure of the creation.
 */
router.post('/', async (req, res) => {
	console.log('POST /api/service called with body:', req.body)

	const { returnApiResponse = true, ...data } = req.body
	const response = await Service.insert(data, returnApiResponse) as ApiResponse
	res.json(response)
})

/**
 * Updates an existing service with the provided data.
 * 
 * PUT /api/service
 * 
 * Request Body:
 * - id: string - The unique identifier of the service to update.
 * - data: Partial<Service> - The data fields to update for the service.
 * > - name?: string - The name of the service.
 * > - description?: string - The description of the service.
 * > - details?: string - The details of the service.
 * > - sortOrder?: number - The sort order of the service.
 * > - topService?: boolean - Whether the service is a top service.
 * > - packages?: Package[] - The packages associated with the service. This will replace existing packages.
 * >> - name: string - The unique identifier for the package.
 * >> - description: string - The description of the package.
 * >> - cost: number - The approximate cost of the package to the provider. 
 * >> - price: number - The price charged to the customer for the package.
 * >> - duration: number - The duration of the package in minutes.
 * - returnApiResponse: boolean - Whether to return the updated service or an ApiResponse.
 * 
 * Response:
 * - The updated Service instance or an ApiResponse indicating success or failure.
 */
router.put('/', async (req, res) => {
	console.log('PUT /api/service called with body:', req.body)

	const { id, data, returnApiResponse = true } = req.body
	const updatedResponse = await Service.update(id, data, returnApiResponse) as ApiResponse
	res.json(updatedResponse)
})

/**
 * Deletes a service by its unique identifier.
 * 
 * DELETE /api/service
 * 
 * Request Body:
 * - id: string - The unique identifier of the service to delete.
 * - returnApiResponse: boolean - Whether to return a boolean or an ApiResponse.
 * 
 * Response:
 * - True if deletion was successful, false otherwise, or an ApiResponse.
 */
router.delete('/', async (req, res) => {
	console.log('DELETE /api/service called with body:', req.body)

	const { id, returnApiResponse = true } = req.body
	const deleteResponse = await Service.delete(id, Boolean(returnApiResponse)) as ApiResponse
	res.json(deleteResponse)
})

/**
 * Validates service data without creating or updating a service.
 * 
 * GET /api/service/validate
 * 
 * Query Parameters:
 * - Any service fields to validate.
 * > - id: string - The unique identifier for the service.
 * > - name: string - The name of the service.
 * > - description: string - The description of the service.
 * > - details: string - The details of the service.
 * > - sortOrder: number - The sort order of the service.
 * > - topService: boolean - Whether the service is a top service.
 * > - packages: Package[] - The packages associated with the service.
 * >> - id: string - The unique identifier for the package.
 * >> - name: string - The unique identifier for the package.
 * >> - description: string - The description of the package.
 * >> - cost: number - The approximate cost of the package to the provider. 
 * >> - price: number - The price charged to the customer for the package.
 * >> - duration: number - The duration of the package in minutes.
 * - returnApiResponse: boolean - Whether to return the validation result.
 * 
 * Response:
 * - The validation result or an ApiResponse.
 */
router.get('/validate', async (req, res) => {
	console.log('GET /api/service/validate called with query:', req.query)

	const { returnApiResponse = true, ...data } = req.query as Record<string, any>
	const validationResponse = Service.validate(data)
	res.json(validationResponse)
})

/**
 * Finds a service package based on service ID and package data.
 *
 * GET /api/service/package
 * 
 * Query Parameters:
 * - `serviceId`: string - The unique identifier of the service.
 * - `packageData`: Partial<Package> - The package data to match.
 * > - `id`: string | string[] - Unique identifier(s) of the package
 * > - `name`: string - Name of the package (to match partially, case-insensitive)
 * > - `description`: string - Description of the package (to match partially, case-insensitive)
 * > - `cost`: number - Exact cost of the package
 * > - `minCost`: number - Minimum cost of the package if no exact cost is provided
 * > - `maxCost`: number - Maximum cost of the package if no exact cost is provided
 * > - `price`: number - Price of the package (to match partially, case-insensitive)
 * > - `minPrice`: number - Minimum price of the package if no exact price is provided
 * > - `maxPrice`: number - Maximum price of the package if no exact price is provided
 * > - `duration`: number - Exact duration of the package in minutes
 * > - `minDuration`: number - Minimum duration of the package in minutes if no exact duration is provided
 * > - `maxDuration`: number - Maximum duration of the package in minutes if no exact duration is provided
 * - `returnApiResponse`: boolean - Whether to return the package or an ApiResponse.
 * 
 * Response:
 * - The matched Package or an ApiResponse.
 */
router.get('/package', async (req, res) => {
	console.log('GET /api/service/package called with query:', req.query)

	const serviceId = req.query.serviceId as string
	const packageData = req.query.packageData as Partial<Record<string, any>>
	const returnApiResponse = req.query.returnApiResponse as boolean | undefined || true
	const response = await Service.findPackage(serviceId, packageData, returnApiResponse) as ApiResponse
	res.json(response)
})

/**
 * Adds a new package to an existing service.
 * 
 * POST /api/service/package
 * 
 * Request Body:
 * - `serviceId`: string - The unique identifier of the service to add the package to.
 * - `packageData`: Package - The package data to add.
 * > - `name`: string - The unique identifier for the package.
 * > - `description`: string - The description of the package.
 * > - `cost`: number - The approximate cost of the package to the provider. 
 * > - `price`: number - The price charged to the customer for the package.
 * > - `duration`: number - The duration of the package in minutes.
 * - `returnApiResponse`: boolean - Whether to return the added package or an ApiResponse.
 * 
 * Response:
 * - The added Package or an ApiResponse.
 */
router.post('/package', async (req, res) => {
	console.log('POST /api/service/package called with body:', req.body)

	const { serviceId, packageData, returnApiResponse = true } = req.body
	const response = await Service.addPackage(serviceId, packageData, returnApiResponse) as ApiResponse
	res.json(response)
})

/**
 * Updates an existing package of a service.
 *
 * PUT /api/service/package
 * 
 * Request Body:
 * - `packageId`: string - The unique identifier of the package to update.
 * - `packageData`: Partial<Package> - The package data fields to update.
 * > - `parentId`?: string - The unique identifier of the parent service.
 * > - `index`?: number - The index of the package in the service's package list.
 * > - `name`?: string - The unique identifier for the package.
 * > - `description`?: string - The description of the package.
 * > - `cost`?: number - The approximate cost of the package to the provider.
 * > - `price`?: number - The price charged to the customer for the package.
 * > - `duration`?: number - The duration of the package in minutes.
 * - `returnApiResponse`: boolean - Whether to return the updated package or an ApiResponse.
 * 
 * Response:
 * - The updated Package or an ApiResponse.
 */
router.put('/package', async (req, res) => {
	console.log('PUT /api/service/package called with body:', req.body)

	const { packageId, packageData, returnApiResponse = true } = req.body
	const response = await Service.updatePackage(packageId, packageData, returnApiResponse) as ApiResponse
	res.json(response)
})

/**
 * Removes a package from a service.
 *
 * DELETE /api/service/package
 */
router.delete('/package', async (req, res) => {
	console.log('DELETE /api/service/package called with body:', req.body)

	const { packageId, returnApiResponse = true } = req.body
	const response = await Service.removePackage(packageId, returnApiResponse) as ApiResponse
	res.json(response)
})

export default router
