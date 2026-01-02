import mongoose from "mongoose"
import db from "../database"
import { type ApiResponse, apiResponse } from "../lib/apiResponse"
import { ElementType, Flatten, FlattenChild, Optional, Queryable, Ranged } from "../lib/customUtilityTypes"

/////////////////////////////////
/// DATABASE SCHEMA AND MODEL ///
/////////////////////////////////
// #region Schema
const serviceSchema = new mongoose.Schema({
	_id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
	name: { type: String, required: true },
	description: { type: String, required: true },
	details: { type: String, required: true },
	sortOrder: { type: Number, required: true },
	topService: { type: Boolean, required: true, default: false },
	packages: {
		type: [{
			_id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
			name: { type: String, required: true },
			description: { type: String, required: true },
			cost: { type: Number, required: true },
			price: { type: Number, required: true },
			duration: { type: Number, required: true }
		}], required: true, default: []
	}
})

const ServiceModel = db.model('Service', serviceSchema)

// #endregion Schema



////////////////////////
/// MODEL INTERFACES ///
////////////////////////
// #region Interfaces

export interface ServiceType {
	id: string
	name: string
	description: string
	details: string
	sortOrder: number
	topService: boolean
	packages: {
		id: string
		name: string
		description: string
		cost: number
		price: number
		duration: number
	}[]
}

type packagesType = ServiceType['packages']
type PackageType = ElementType<packagesType>

type FilterType = Partial<
	Queryable<
		Omit<ServiceType, 'packages'> & Flatten<
			Ranged<
				PackageType, 
				'cost' | 'price' | 'duration'
			>, 'package'
		>, 'id' | 'package_id'
	>
>

type InputType = Omit<
	Optional<
		ServiceType, 
		'id' | 'sortOrder'
	>, 'packages'
> & {
	packages: Optional<PackageType, 'id'>[]
}

type UpdateType = Partial<Omit<ServiceType, 'id'>>

// #endregion Interfaces



/////////////////////
/// SERVICE CLASS ///
/////////////////////
// #region Service Class

/** Service Model class
 * 
 * Represents a service offered by the business, including its packages.
 * 
 * Properties:
 * - id: Unique identifier for the service
 * - name: Name of the service
 * - description: Brief description of the service
 * - details: Detailed information about the service
 * - sortOrder: Order in which the service is displayed
 * - topService: Indicates if the service is a top service
 * - packages: Array of packages under this service
 * > - id: Unique identifier for the package
 * > - name: Name of the package
 * > - description: Description of the package
 * > - cost: The approximate cost of the package to the provider
 * > - price: The price charged to the customer for the package
 * > - duration: Duration of the package in minutes
 * Methods:
 * - static find(filters?: Filters): Promise<Service[]>
 * - static insert(data: Omit<Service, 'id'>): Promise<Service>
 * - static update(id: string, data: Partial<Omit<Service, 'id'>>): Promise<Service | null>
 * - static delete(id: string): Promise<boolean>
 */
class Service implements ServiceType {

	//////////////////
	/// PROPERTIES ///
	//////////////////
	// #region Properties

	private _id: string
	private _name: string
	private _description: string
	private _details: string
	private _sortOrder: number
	private _topService: boolean
	private _packages: Packages

	constructor(data: ServiceType) {
		this._id = data.id
		this._name = data.name
		this._description = data.description
		this._details = data.details
		this._sortOrder = data.sortOrder
		this._topService = data.topService
		this._packages = new Packages(this, data.packages)
	}

	/** The unique identifier of the service. */
	get id() { return this._id }

	/** The name of the service. */
	get name() { return this._name }
	set name(value: string) {
		const validationResult = Service.validateName(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._name = (validationResult.data as { name: string }).name
	}

	/** A brief description of the service. */
	get description() { return this._description }
	set description(value: string) {
		const validationResult = Service.validateDescription(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._description = (validationResult.data as { description: string }).description
	}

	/** Detailed information about the service. 
	 * - This can use markdown formatting. */
	get details() { return this._details }
	set details(value: string) {
		const validationResult = Service.validateDetails(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._details = (validationResult.data as { details: string }).details
	}

	/** The display order of the service. */
	get sortOrder() { return this._sortOrder }
	set sortOrder(value: number) {
		const validationResult = Service.validateSortOrder(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._sortOrder = (validationResult.data as { sortOrder: number }).sortOrder
	}
	/** Set the sort order of the service, adjusting other services accordingly.
	 * 
	 * @param value The new sort order value.
	 * @param returnApiResponse Whether to return an ApiResponse or the Service instance.
	 * @returns The updated Service instance or an ApiResponse indicating success or failure.
	 */ 
	async setSortOrder(value: number, returnApiResponse: boolean = true) : Promise<Service | ApiResponse> {
		const code = 'UPDATE_SERVICE_SORT_ORDER'

		// Validate the new sort order.
		const validationResult = Service.validateSortOrder(value, true) as ApiResponse
		if (!validationResult.passed) {
			if (!returnApiResponse) throw new Error(validationResult.message)
			return validationResult
		}

		value = (validationResult.data as { sortOrder: number }).sortOrder

		// Check that the new sort order is within valid range.
		const serviceCount = await ServiceModel.countDocuments().exec()
		if (value < 0) value = 0
		else if (value >= serviceCount) value = serviceCount - 1

		// If the sort order is not changing, do nothing.
		if (this._sortOrder === value) {
			return !returnApiResponse ? this
				: apiResponse(201, code, false, 'Sort order is already set to the specified value.', this, 'service_update_sort_order')
		}

		// Update sort orders of other services accordingly.
		if (this._sortOrder < value) {
			// Moving down: Decrease sortOrder of services between old and new position.
			await ServiceModel.updateMany(
				{ sortOrder: { $gt: this._sortOrder, $lte: value } },
				{ $inc: { sortOrder: -1 } }
			)
		} else {
			// Moving up: Increase sortOrder of services between new and old position.
			await ServiceModel.updateMany(
				{ sortOrder: { $gte: value, $lt: this._sortOrder } },
				{ $inc: { sortOrder: 1 } }
			)
		}
		
		// Set the new sort order for this service.
		this._sortOrder = value

		// Save the updated service.
	
		const updatedService = await ServiceModel.findByIdAndUpdate(this._id, { sortOrder: this._sortOrder }, { new: true }).exec()

		if (!updatedService) {
			const errorMsg = 'Failed to update service sort order.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(400, code, false, errorMsg, { id: this._id, sortOrder: this._sortOrder }, 'service_update_sort_order')
		}

		// Return the result.
		return !returnApiResponse ? this
			: apiResponse(200, code, true, 'Service sort order updated successfully.', this, 'service_update_sort_order')
	}

	/** Whether the service is marked as a top service. */
	get topService() { return this._topService }
	set topService(value: boolean) {
		const validationResult = Service.validateTopService(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._topService = (validationResult.data as { topService: boolean }).topService
	}

	/** The packages associated with the service. */
	get packages() { return this._packages.toJSON() }
	/** Set the packages associated with the service.
	 * - This will replace all existing packages.
	 */
	set packages(value: PackageType[]) {
		this._packages = new Packages(this, value)
	}
	

	/** Update the service with the provided data.
	 * 
	 * @param data Partial data to update the service.
	 * - name: string (optional) - The name of the service.
	 * - description: string (optional) - A brief description of the service.
	 * - details: string (optional) - Detailed information about the service.
	 * - sortOrder: number (optional) - The display order of the service.
	 * - topService: boolean (optional) - Whether the service is marked as a top service.
	 * - packages: Package[] (optional) - The packages associated with the service. This will replace all existing packages.
	 * > - name: string - The name of the package.
	 * > - description: string - A brief description of the package.
	 * > - cost: number - The approximate cost of the package to the provider.
	 * > - price: number - The price charged to the customer for the package.
	 * > - duration: number - The duration of the package in minutes.
	 * @param returnApiResponse Whether to return the updated service or an ApiResponse.
	 * @returns The updated Service instance or an ApiResponse indicating success or failure.
	 */
	async update(data: Partial<Omit<Service, 'id'>>, returnApiResponse: boolean = true) : Promise<Service | ApiResponse> {
		const code = 'UPDATE_SERVICE'

		// Make sure there is data to update.
		if (Object.keys(data).length === 0) {
			const errorMsg = 'No data provided for update.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(400, code, false, errorMsg, { id: this._id, data }, 'service_update')
		}

		// Validate the provided data.
		const validationResult = Service.validate(data, true) as ApiResponse
		if (!validationResult.passed) {
			if (!returnApiResponse) throw new Error(validationResult.message)
			return validationResult
		}

		data = validationResult.data as Partial<Omit<Service, 'id'>>
		
		// If sort order is being updated, handle it separately.
		if (data.sortOrder !== undefined) {
			const sortOrderResult = await this.setSortOrder(data.sortOrder, true) as ApiResponse
			
			if (!sortOrderResult.passed) {
				if (!returnApiResponse) throw new Error(sortOrderResult.message)
				return sortOrderResult
			}
		}

		// Update the values.
		if (data.name !== undefined) this._name = data.name
		if (data.description !== undefined) this._description = data.description
		if (data.details !== undefined) this._details = data.details
		if (data.topService !== undefined) this._topService = data.topService
		if (data.packages !== undefined) this._packages = new Packages(this, data.packages)

		// Save the updated service.
		const updatedService = await this.save()

		if (!updatedService) {
			const errorMsg = 'Failed to update service.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { id: this._id, data }, 'service_update')
		}

		// Return the result.
		return !returnApiResponse ? this : updatedService
	}

	/** Save the current service instance to the database. */
	async save(returnApiResponse: boolean = true) : Promise<Service | ApiResponse> {
		const code = 'SAVE_SERVICE'

		// Prepare the data to be saved.
		const dataToSave = {
			name: this._name,
			description: this._description,
			details: this._details,
			sortOrder: this._sortOrder,
			topService: this._topService,
			packages: this._packages.toJSON()
		}

		// Update the service in the database.
		const updatedService = await ServiceModel.findByIdAndUpdate(this._id, dataToSave, { new: true }).exec()
		
		if (!updatedService) {
			if (!returnApiResponse) throw new Error('Failed to update service')
			return apiResponse(400, code, false, 'Failed to update service', this.toJSON(), 'service_save')
		}

		// Return the result.
		return !returnApiResponse ? this
			: apiResponse(200, code, true, 'Service saved successfully', this.toJSON(), 'service_save')
	}

	toJSON(): ServiceType {
		return {
			id: this._id,
			name: this._name,
			description: this._description,
			details: this._details,
			sortOrder: this._sortOrder,
			topService: this._topService,
			packages: this._packages.toJSON()
		}
	}

	toString(): string {
		return `Service: '${this._name}' ('${this._id}')`
	}

	toRepr(): string {
		return `Service { id: ${this._id}, name: ${this._name}, description: ${this._description}, details: ${this._details}, sortOrder: ${this._sortOrder}, topService: ${this._topService}, packages: [${this._packages.toJSON()}] }`
	}

	// #endregion Properties



	//////////////////////
	/// STATIC METHODS ///
	//////////////////////
	// #region Static Methods

	/** Find services based on provided filters.
	 * 
	 * @param filters Optional filters to apply to the search. If omitted, all services are returned.
	 * Filter options include:
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
	 * @param returnApiResponse Whether to return the services or an ApiResponse.
	 * @returns Promise resolving to an array of Service instances matching the filters.
	 * 
	 * @example
	 * // Find all services
	 * const allServices = await Service.find()
	 * 
	 * // Find services with name containing "therapy"
	 * const therapyServices = await Service.find({ name: 'therapy' })
	 * 
	 * // Find top services with package cost between 100 and 500
	 * const topCostlyServices = await Service.find({ topService: true, package_minCost: 100, package_maxCost: 500 })
	 */
	static async find(filters?: FilterType, returnApiResponse: boolean = true): Promise<Service[] | ApiResponse> {
		const code = 'FIND_SERVICES'

		// If no filters provided, return all services
		if (!filters || Object.keys(filters).length === 0) {
			const serviceDatas = await ServiceModel.find().exec()
			const services = serviceDatas.map((sd: { toObject: () => Service }) => new Service(sd.toObject()))
			return !returnApiResponse ? services
				: apiResponse(200, code, true, 'All services retrieved successfully.', services, 'service_find')
		}

		// Build the query based on provided filters.
		const query: Record<string, unknown> = {}

		if (filters.id) query.id = Array.isArray(filters.id) ? { $in: filters.id } : filters.id
		if (filters.name) query.name = { $regex: filters.name, $options: 'i' }
		if (filters.description) query.description = { $regex: filters.description, $options: 'i' }
		if (filters.details) query.details = { $regex: filters.details, $options: 'i' }
		if (filters.topService !== undefined) query.topService = filters.topService
		if (filters.package_id) query['packages._id'] = Array.isArray(filters.package_id) ? { $in: filters.package_id } : filters.package_id
		if (filters.package_name) query['packages.name'] = { $regex: filters.package_name, $options: 'i' }
		if (filters.package_description) query['packages.description'] = { $regex: filters.package_description, $options: 'i' }
		if (filters.package_cost !== undefined) query['packages.cost'] = filters.package_cost
		else {
			if (filters.package_minCost !== undefined || filters.package_maxCost !== undefined) {
				query['packages.cost'] = {} as Record<string, number>
				if (filters.package_minCost !== undefined) (query['packages.cost'] as Record<string, number>).$gte = filters.package_minCost
				if (filters.package_maxCost !== undefined) (query['packages.cost'] as Record<string, number>).$lte = filters.package_maxCost
			}
		}
		if (filters.package_price !== undefined) query['packages.price'] = filters.package_price
		else {
			if (filters.package_minPrice !== undefined || filters.package_maxPrice !== undefined) {
				query['packages.price'] = {} as Record<string, number>
				if (filters.package_minPrice !== undefined) (query['packages.price'] as Record<string, number>).$gte = filters.package_minPrice
				if (filters.package_maxPrice !== undefined) (query['packages.price'] as Record<string, number>).$lte = filters.package_maxPrice
			}
		}
		if (filters.package_duration !== undefined) query['packages.duration'] = filters.package_duration
		else {
			if (filters.package_minDuration !== undefined || filters.package_maxDuration !== undefined) {
				query['packages.duration'] = {} as Record<string, number>
				if (filters.package_minDuration !== undefined) (query['packages.duration'] as Record<string, number>).$gte = filters.package_minDuration
				if (filters.package_maxDuration !== undefined) (query['packages.duration'] as Record<string, number>).$lte = filters.package_maxDuration
			}
		}

		const serviceDatas = await ServiceModel.find(query).exec()
		const services = serviceDatas.map((sd: { toObject: () => Service }) => new Service(sd.toObject()))
		return !returnApiResponse ? services
			: apiResponse(201, code, true, 'Services retrieved successfully.', services, 'service_find')
	}

	/** Insert a new service into the database.
	 * 
	 * @param data Data for the new service:
	 * - id: string (optional) - Unique identifier for the service. If not provided, it will be auto-generated.
	 * - name: string - Name of the general service.
	 * - description: string - Description of the general service.
	 * - details: string - Detailed information about the general service. Use Markdown formatting if needed.
	 * - topService: boolean - Whether the service should be marked listed as a top service.
	 * - packages: Packages[] - Array of packages under this general service.
	 * > - id: string (optional) - Unique identifier for the package. If not provided, it will be auto-generated.
	 * > - name: string - Name of the package.
	 * > - description: string - Description of the package.
	 * > - cost: number - Cost of the package to the provider.
	 * > - price: number - Price of the package charged to the customer.
	 * > - duration: number - Duration of the package in minutes.
	 * @param returnApiResponse Whether to return the inserted service or an ApiResponse.
	 */
	static async insert(data: InputType, returnApiResponse: boolean = true): Promise<Service | ApiResponse> {
		const code = 'INSERT_SERVICE'

		// Add an id if not provided.
		if (!data.id) data.id = new mongoose.Types.ObjectId().toString()
		if (!data.packages) data.packages = []
		for (let packageData of data.packages) {
			if (!packageData.id) packageData.id = new mongoose.Types.ObjectId().toString()
		}

		// Validate the provided data.
		const validationResult = Service.validate(data, true) as ApiResponse
		if (!validationResult.passed) {
			if (!returnApiResponse) throw new Error(validationResult.message)
			return validationResult
		}

		data = validationResult.data as InputType

		// Set the sort order to be the last in the list.
		const count = await ServiceModel.countDocuments().exec()
		data.sortOrder = count

		// Insert the new service into the database.
		const inputData: Omit<typeof data, 'id'> & { _id?: string } = {
			name: data.name,
			description: data.description,
			details: data.details,
			sortOrder: data.sortOrder,
			topService: data.topService,
			packages: data.packages.map(pkg => ({
				_id: pkg.id,
				name: pkg.name,
				description: pkg.description,
				cost: pkg.cost,
				price: pkg.price,
				duration: pkg.duration
			}))
		}
		if (data.id) inputData._id = data.id 

		const newServiceModel = new ServiceModel(inputData)
		let savedServiceModel
		try {
			savedServiceModel = await newServiceModel.save()
		} catch (e) {
			const [errorMsg, errorId] = ((e: unknown) => {
				if (!(e instanceof Error)) return ['Failed to insert new service into database.', 499]
				if (e.message.startsWith('E11000')) return ['A service with the provided id already exists.', 400]
				return ['Failed to insert new service into database:\n' + e.message, 498]
			})(e)

			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(errorId, code, false, errorMsg, { data }, 'service_insert')
		}
		const serviceData = savedServiceModel.toObject() as unknown as Service
		const newService = new Service(serviceData)

		return !returnApiResponse ? newService
			: apiResponse(200, code, true, 'Service inserted successfully.', newService, 'service_insert')
	}

	/** Update an existing service by id.
	 * 
	 * @param id The id of the service to update.
	 * @param data The data to update:
	 * - name: string (optional) - The name of the service.
	 * - description: string (optional) - A brief description of the service.
	 * - details: string (optional) - Detailed information about the service.
	 * - sortOrder: number (optional) - The display order of the service.
	 * - topService: boolean (optional) - Whether the service is marked as a top service.
	 * - packages: Package[] (optional) - The packages associated with the service. This will replace all existing packages.
	 * > - name: string - The name of the package.
	 * > - description: string - A brief description of the package.
	 * > - cost: number - The approximate cost of the package to the provider.
	 * > - price: number - The price charged to the customer for the package.
	 * > - duration: number - The duration of the package in minutes.
	 * @param returnApiResponse Whether to return the updated service or an ApiResponse.
	 * @returns The updated Service instance or an ApiResponse indicating success or failure.
	 */
	static async update(id: string, data: Partial<Omit<Service, 'id'>>, returnApiResponse: boolean = true) {
		const code = 'STATIC_UPDATE_SERVICE'

		// Find the service instance.
		const serviceInstance = await ServiceModel.findById(id).exec()

		if (!serviceInstance) {
			const errorMsg = `The service with id ${id} not found.`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { id, data }, 'service_update')
		}

		// Create a Service object from the found data.
		const serviceData = serviceInstance.toObject() as unknown as Service
		const service = new Service(serviceData)

		// Use the instance's update method to perform the update.
		return service.update(data, returnApiResponse)
	}

	/** Delete a service by id.
	 *
	 * @param id The id of the service to delete.
	 * @param returnApiResponse Whether to return a boolean or an ApiResponse.
	 * @returns True if deletion was successful, false otherwise, or an ApiResponse.
	 */
	static async delete(id: string, returnApiResponse: boolean = true): Promise<boolean | ApiResponse> {
		const code = 'DELETE_SERVICE'

		const deletedService = await ServiceModel.findByIdAndDelete(id).exec()
		const passed = deletedService !== null

		if (!passed) {
			const errorMsg = `Service with id ${id} not found for deletion.`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(400, code, false, errorMsg, { id }, 'service_delete')
		}

		// Adjust sort orders of remaining services.
		const deletedSortOrder = deletedService.sortOrder
		await ServiceModel.updateMany(
			{ sortOrder: { $gt: deletedSortOrder } },
			{ $inc: { sortOrder: -1 } }
		).exec()

		// Return the result.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service deleted successfully.', { id }, 'service_delete')
	}

	/** Find a package within a service by package data.
	 * 
	 * @param serviceId The id of the service to search within.
	 * @param packageData The package data to search for:
	 * - id: string (optional) - The unique identifier of the package.
	 * - name: string (optional) - The name of the package (to match partially, case-insensitive).
	 * - description: string (optional) - The description of the package (to match partially, case-insensitive).
	 * - cost: number | { min?: number; max?: number } (optional) - The cost of the package or a range to search within.
	 * - price: number | { min?: number; max?: number } (optional) - The price of the package or a range to search within.
	 * - duration: number | { min?: number; max?: number } (optional) - The duration of the package in minutes or a range to search within.
	 * @param returnApiResponse Whether to return the found package or an ApiResponse.
	 * @returns The found Package instance or an ApiResponse indicating success or failure.
	 */
	static async findPackage(serviceId: string, packageData: Partial<Ranged<Queryable<PackageType, 'id'>, 'cost' | 'price' | 'duration'>>, returnApiResponse: boolean = true): Promise<PackageType | ApiResponse> {
		const code = 'SERVICE_FIND_PACKAGE'

		// Find the service instance.
		const serviceInstance = await Service.find({ id: serviceId }, true) as ApiResponse

		if (!serviceInstance.passed) {
			if (!returnApiResponse) throw new Error(serviceInstance.message)
			return serviceInstance
		}

		const service = (serviceInstance.data as Service[])[0]

		// Use the instance's packages to find the package.
		const response = await service._packages.find(packageData, true) as ApiResponse

		if (!response.passed) {
			if (!returnApiResponse) throw new Error(response.message)
			return response
		}

		const found = response.data as ApiResponse

		// Return the found package.
		return !returnApiResponse ? found
			: apiResponse(200, code, true, 'Package found successfully.', found, 'service_find_package')
	}

	/** Add a new package to a service.
	 *
	 * @param serviceId The id of the service to add the package to.
	 * @param packageData The data for the new package:
	 * - id: string (optional) - The unique identifier of the package. If not provided, a new id will be generated.
	 * - name: string - The name of the package.
	 * - description: string - A brief description of the package.
	 * - cost: number - The approximate cost of the package to the provider.
	 * - price: number - The price charged to the customer for the package.
	 * - duration: number - The duration of the package in minutes.
	 * @param returnApiResponse Whether to return the added package or an ApiResponse.
	 * @returns The added Package instance or an ApiResponse indicating success or failure.
	 */
	static async addPackage(serviceId: string, packageData: Optional<PackageType, 'id'>, returnApiResponse: boolean = true): Promise<PackageType | ApiResponse> {
		const code = 'SERVICE_ADD_PACKAGE'

		// Find the service instance.
		const serviceInstance = await Service.find({ id: serviceId }, true) as ApiResponse
		if (!serviceInstance.passed) {
			if (!returnApiResponse) throw new Error(serviceInstance.message)
			return serviceInstance
		}

		const service = (serviceInstance.data as Service[])[0]

		// Use the instance's packages to add the package.
		const response = await service._packages.add(packageData, true) as ApiResponse

		if (!response.passed) {
			if (!returnApiResponse) throw new Error(response.message)
			return response
		}

		const added = response.data as PackageType

		// Save the updated service.
		const saveResult = await service.save(true) as ApiResponse

		if (!saveResult.passed) {
			if (!returnApiResponse) throw new Error(saveResult.message)
			return saveResult
		}

		// Return the added package.
		return !returnApiResponse ? added
			: apiResponse(200, code, true, 'Package added successfully.', added, 'service_add_package')
	}

	/** Update an existing package within a service.
	 * 
	 * @param packageId The id of the package to update.
	 * @param packageData The data to update the package:
	 * - name: string (optional) - The name of the package.
	 * - description: string (optional) - A brief description of the package.
	 * - cost: number (optional) - The approximate cost of the package to the provider.
	 * - price: number (optional) - The price charged to the customer for the package.
	 * - duration: number (optional) - The duration of the package in minutes.
	 * @param returnApiResponse Whether to return the updated package or an ApiResponse.
	 * @returns The updated Package instance or an ApiResponse indicating success or failure.
	 */
	static async updatePackage(packageId: string, packageData: Partial<Omit<PackageType, 'id'>>, returnApiResponse: boolean = true): Promise<PackageType | ApiResponse> {
		const code = 'SERVICE_UPDATE_PACKAGE'

		// Find the service instance.
		const serviceInstance = await Service.find({ 'package_id': packageId }, true) as ApiResponse

		if (!serviceInstance.passed) {
			if (!returnApiResponse) throw new Error(serviceInstance.message)
			return serviceInstance
		}

		const service = (serviceInstance.data as Service[])[0]

		// Use the instance's packages to update the package.
		const response = await service._packages.update(packageId, packageData, true) as ApiResponse

		if (!response.passed) {
			if (!returnApiResponse) throw new Error(response.message)
			return response
		}

		const updated = response.data as PackageType

		// Save the updated service.
		const saveResult = await service.save(true) as ApiResponse

		if (!saveResult.passed) {
			if (!returnApiResponse) throw new Error(saveResult.message)
			return saveResult
		}

		// Return the updated package.
		return !returnApiResponse ? updated
			: apiResponse(200, code, true, 'Package updated successfully.', updated, 'service_update_package')
	}

	/** Remove a package from a service by package id.
	 *
	 * @param packageId The id of the package to remove.
	 * @param returnApiResponse Whether to return a boolean or an ApiResponse.
	 * @returns True if removal was successful, false otherwise, or an ApiResponse.
	 */
	static async removePackage(packageId: string, returnApiResponse: boolean = true): Promise<boolean | ApiResponse> {
		const code = 'SERVICE_REMOVE_PACKAGE'

		// Find the service instance.
		const serviceInstance = await Service.find({ 'package_id': packageId }, true) as ApiResponse

		if (!serviceInstance.passed) {
			if (!returnApiResponse) throw new Error(serviceInstance.message)
			return serviceInstance
		}

		const service = (serviceInstance.data as Service[])[0]

		// Use the instance's packages to remove the package.
		const response = await service._packages.remove(packageId, true) as ApiResponse

		if (!response.passed) {
			if (!returnApiResponse) throw new Error(response.message)
			return response
		}

		const removed = response.data as boolean

		// Save the updated service.
		const saveResult = await service.save(true) as ApiResponse
		
		if (!saveResult.passed) {
			if (!returnApiResponse) throw new Error(saveResult.message)
			return saveResult
		}

		// Return the result.
		return !returnApiResponse ? removed
			: apiResponse(200, code, true, 'Package removed successfully.', { packageId, removed }, 'service_remove_package')
	}

	// #endregion Static Methods



	///////////////////////////////
	/// DATA VALIDATION METHODS ///
	///////////////////////////////
	// #region Data Validation

	static validate(values: Record<string, any>, returnApiResponse: boolean = true): boolean | ApiResponse {
		const code = 'VALIDATE_SERVICE'

		const validValues: Record<string, any> = {}
		const options = {
			id: Service.validateId,
			name: Service.validateName,
			description: Service.validateDescription,
			details: Service.validateDetails,
			sortOrder: Service.validateSortOrder,
			topService: Service.validateTopService,
			packages: Service.validatePackages
		} as Record<string, (value: any, returnApiResponse: boolean) => any>

		// Check that at least one value is provided.
		if (!values || Object.keys(values).length === 0)
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'No service values provided for validation.', {}, 'service')

		// Validate each provided value using the corresponding validation function.
		for (const [oKey, oValue] of Object.entries(values)) {
			const validateFn = options[oKey]

			if (!validateFn)
				return !returnApiResponse ? false
					: apiResponse(401, code, false, `Validation function for ${oKey} not found.`, { [oKey]: oValue }, 'service')

			const key = oKey as keyof Record<string, any>
			
			// Validate the value.
			const result = validateFn(oValue, true) as ApiResponse
			
			if (!result.passed) return !returnApiResponse ? false : result
			
			// Store the valid value.
			validValues[key] = (result.data as Record<string, any>)[key]
		}

		// All values are valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'All service values are valid.', validValues as Partial<Omit<Service, 'id'>>, 'service')
	}

	static validateId(value: any, returnApiResponse: boolean = true): boolean | ApiResponse {
		const code = 'VALIDATE_SERVICE_ID'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Service id must be a string.', { id: value }, 'service_id')

		// Trim the value and set to id.
		const id = value.trim() as string

		// Check that id a valid MongoDB ObjectId.
		const objectIdRegex = /^[0-9a-fA-F]{24}$/
		if (!objectIdRegex.test(id))
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Service id must be a valid MongoDB ObjectId.', { id }, 'service_id')

		// Id is valid
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service id is valid.', { id }, 'service_id')
	}

	static validateName(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_SERVICE_NAME'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Service name must be a string.', { name: value }, 'service_name')

		// Trim the value and set to name.
		const name = value.trim() as string

		// Validate name length.
		if (name.length === 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Service name cannot be empty.', { name }, 'service_name')

		const minLength = 3
		if (name.length < minLength)
			return !returnApiResponse ? false
				: apiResponse(402, code, false, `Service name must be at least ${minLength} characters long.`, { name }, 'service_name')

		const maxLength = 100
		if (name.length > maxLength)
			return !returnApiResponse ? false
				: apiResponse(403, code, false, `Service name must be no more than ${maxLength} characters long.`, { name }, 'service_name')

		// Name is valid
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service name is valid.', { name }, 'service_name')
	}

	static validateDescription(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_SERVICE_DESCRIPTION'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Service description must be a string.', { description: value }, 'service_description')

		// Trim the value and set to description.
		const description = value.trim() as string

		// Validate description length.
		if (description.length === 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Service description cannot be empty.', { description }, 'service_description')

		const minLength = 10
		if (description.length < minLength)
			return !returnApiResponse ? false
				: apiResponse(402, code, false, `Service description must be at least ${minLength} characters long.`, { description }, 'service_description')
		const maxLength = 500
		if (description.length > maxLength)
			return !returnApiResponse ? false
				: apiResponse(403, code, false, `Service description must be no more than ${maxLength} characters long.`, { description }, 'service_description')

		// Description is valid
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service description is valid.', { description }, 'service_description')
	}

	static validateDetails(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_SERVICE_DETAILS'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Service details must be a string.', { details: value }, 'service_details')

		// Trim the value and set to details.
		const details = value.trim() as string

		// Details is valid
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service details are valid.', { details }, 'service_details')
	}

	static validateSortOrder(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_SERVICE_SORT_ORDER'

		// Attempt to parse it as an integer.
		const sortOrder = typeof value === 'string' ? parseInt(value) : value

		// Check that sort order is a number.
		if (typeof sortOrder !== 'number' || isNaN(sortOrder))
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Service sort order must be a number.', { sortOrder: value }, 'service_sort_order')

		// Check that sort order is an integer.
		if (!Number.isInteger(sortOrder))
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Service sort order must be an integer.', { sortOrder }, 'service_sort_order')

		// Sort order is valid
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service sort order is valid.', { sortOrder }, 'service_sort_order')
	}

	static validateTopService(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_SERVICE_TOP_SERVICE'

		const topService = Boolean(value)

		// Top service is valid
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Service top service flag is valid.', { topService }, 'service_top_service')
	}

	static validatePackages(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_SERVICE_PACKAGE'

		// Check that the value is an array.
		if (!Array.isArray(value))
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Packages must be an array.', { packages: value }, 'service_package')

		// Check that there are at least one package.
		if (value.length === 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Packages cannot be empty.', { packages: value }, 'service_package')

		// Create an array to hold validated packages.
		const validatedPackages = [] as Partial<Package>[]

		// Loop through each package and validate it.
		for (let i = 0; i < value.length; i++) {
			const ss = value[i]
			const result = Package.validate(ss, true) as ApiResponse

			if (!result.passed) return !returnApiResponse ? false : result

			const validatedValues = result.data as Partial<Package>

			validatedPackages.push(validatedValues)
		}

		// Packages are valid
		return apiResponse(200, code, true, 'Packages are valid.', { packages: validatedPackages }, 'service_package')
	}

	// #endregion Data Validation
}

// #endregion Service Class



/////////////////////
/// PACKAGE CLASS ///
/////////////////////
// #region Package Class

class Package implements PackageType {

	//////////////////
	/// PROPERTIES ///
	//////////////////
	// #region Properties

	private _parent: Service
	private _id: string
	private _name: string
	private _description: string
	private _cost: number
	private _price: number
	private _duration: number

	constructor(parent: Service, data: Optional<PackageType, 'id'>) {
		this._parent = parent
		this._id = data.id || new mongoose.Types.ObjectId().toString()
		this._name = data.name
		this._description = data.description
		this._cost = data.cost
		this._price = data.price
		this._duration = data.duration
	}

	/** The parent Service instance that contains this Package. */
	get parent() { return this._parent }
	async setParent(serviceId: string, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
		const code = 'UPDATE_PACKAGE_PARENT'

		// Find the new parent service.
		const result = await Service.find({ id: serviceId }, true) as ApiResponse

		if (!result.passed || (result.data as Service[]).length === 0) {
			const errorMsg = `Service with id ${serviceId} not found.`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(400, code, false, errorMsg, { package: this.toJSON(), newParentServiceId: serviceId }, 'package_update_parent')
		}

		const newParent = (result.data as Service[])[0]

		// If the new parent is the same as the current parent, no changes are needed.
		if (newParent.id === this._parent.id) {
			return !returnApiResponse ? this
				: apiResponse(201, code, true, 'Package parent is already the specified service.', this.toJSON(), 'package_update_parent')
		}

		// Remove this package from the current parent's packages array.
		const oldParent = this._parent
		const currentIndex = this.index

		if (currentIndex === -1) {
			const errorMsg = `Package id ${this._id} not found in current parent service id ${this._parent.id}.`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { package: this.toJSON(), currentParentService: this._parent.toJSON() }, 'package_update_parent')
		}

		this._parent.packages.splice(currentIndex, 1)

		// Add this package to the new parent's packages array.
		newParent.packages.push(this)

		// Update this package's parent reference.
		this._parent = newParent

		// Save both parent services.
		const oldParentSaveResult = await oldParent.save(true) as ApiResponse
		if (!oldParentSaveResult.passed) {
			const errorMsg = 'Failed to save old parent service after package parent update.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(402, code, false, errorMsg, { package: this.toJSON(), oldParentService: oldParent.toJSON() }, 'package_update_parent')
		}

		const newParentSaveResult = await newParent.save(true) as ApiResponse
		if (!newParentSaveResult.passed) {
			const errorMsg = 'Failed to save new parent service after package parent update.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(403, code, false, errorMsg, { package: this.toJSON(), newParentService: newParent.toJSON() }, 'package_update_parent')
		}

		// Return the result.
		return !returnApiResponse ? this
			: apiResponse(200, code, true, 'Package parent updated successfully.', this.toJSON(), 'package_update_parent')
	}

	/** The unique identifier of the Package. */
	get id() { return this._id }

	/** The name of the Package. */
	get name() { return this._name }
	set name(value: string) {
		const validationResult = Package.validateName(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._name = (validationResult.data as { name: string }).name
	}

	/** A brief description of the Package. */
	get description() { return this._description }
	set description(value: string) {
		const validationResult = Package.validateDescription(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._description = (validationResult.data as { description: string }).description
	}

	/** The approximate cost of the Package to the provider. */
	get cost() { return this._cost }
	set cost(value: number) {
		const validationResult = Package.validateCost(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._cost = (validationResult.data as { cost: number }).cost
	}

	/** The price of the Package charged to the customer. */
	get price() { return this._price }
	set price(value: number) {
		const validationResult = Package.validatePrice(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._price = (validationResult.data as { price: number }).price
	}

	/** The duration of the Package in minutes. */
	get duration() { return this._duration }
	set duration(value: number) {
		const validationResult = Package.validateDuration(value, true) as ApiResponse
		if (!validationResult.passed) throw new Error(validationResult.message)
		this._duration = (validationResult.data as { duration: number }).duration
	}

	/** Get the index of this Package within its parent Service's packages array.
	 * 
	 * @returns The index of the Package instance within the parent Service's packages array.
	 * If not found, returns -1.
	 */
	get index(): number {
		const index = this._parent.packages.findIndex(pkg => pkg.id === this._id)
		return index
	}

	/** Move the Package instance to a new index within its parent Service's packages array.
	 * 
	 * @param newIndex The new index to move the package to.
	 * @param returnApiResponse Whether to return an ApiResponse or the Package instance. (default: `false`)
	 * @returns The updated Package instance or an ApiResponse indicating the result of the operation.
	 */
	async setIndex(newIndex: number, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
		const code = 'MOVE_PACKAGE_INSTANCE'

		// Find the current index of this package in the parent's packages array.
		const currentIndex = this._parent.packages.findIndex(pkg => pkg.id === this._id)
		if (currentIndex === -1) {
			const errorMsg = `Package id ${this._id} not found in parent service id ${this._parent.id}.`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { package: this.toJSON(), parentService: this._parent.toJSON() }, 'package_move')
		}

		// Adjust newIndex to be within bounds.
		const adjustedIndex = newIndex < 0 ? 0
			: newIndex >= this._parent.packages.length ? this._parent.packages.length - 1
			: newIndex

		// If the new index is the same as the current index, no changes are needed.
		if (adjustedIndex === currentIndex) {
			return !returnApiResponse ? this
				: apiResponse(201, code, true, 'Package is already at the specified index.', this, 'package_move')
		}

		// Move the package within the parent's packages array.
		const packageToMove = this._parent.packages.splice(currentIndex, 1)[0]
		this._parent.packages.splice(adjustedIndex, 0, packageToMove)
		
		// Save the updated parent service.
		await this._parent.save()

		// Return the result.
		return !returnApiResponse ? this
			: apiResponse(200, code, true, 'Package moved successfully.', this, 'package_move')
	}

	/** Update the Package instance with new data.
	 * 
	 * @param data The new data to update the Package with.
	 * - parentId: string - The id of the new parent Service.
	 * - index: number - The new index of the package within the parent's packages array.
	 * - name: string - Name of the package.
	 * - description: string - Description of the package.
	 * - cost: number - The approximate cost of the package to the provider.
	 * - price: number - The price charged to the customer for the package.
	 * - duration: number - Duration of the package in minutes. 
	 * @param returnApiResponse Whether to return an ApiResponse or the Package instance. (default: `false`)
	 * @returns The updated Package instance or an ApiResponse indicating the result of the operation.
	 */
	async update(data: Partial<Omit<Package, 'id'>> & { parentId?: string, index?: number }, returnApiResponse: boolean = true) : Promise<Package | ApiResponse> {
		const code = 'UPDATE_PACKAGE_INSTANCE'

		// Validate the provided data.
		const validationResult = Package.validate(data, true) as ApiResponse
		
		if (!validationResult.passed) { 
			if (!returnApiResponse) throw new Error(validationResult.message)
			return validationResult
		}

		data = validationResult.data as Partial<Omit<Package, 'id'>>

		// If parent id is being updated, handle that first.
		if (data.parentId !== undefined) {
			const parentUpdateResult = await this.setParent(data.parentId, true) as ApiResponse

			if (!parentUpdateResult.passed) {
				if (!returnApiResponse) throw new Error(parentUpdateResult.message)
				return parentUpdateResult
			}
		}

		// If index is being updated, handle that next.
		if (data.index !== undefined) {
			const indexUpdateResult = await this.setIndex(data.index, true) as ApiResponse

			if (!indexUpdateResult.passed) {
				if (!returnApiResponse) throw new Error(indexUpdateResult.message)
				return indexUpdateResult
			}
		}

		// Update the package properties.

		if (data.name !== undefined) this._name = data.name
		if (data.description !== undefined) this._description = data.description
		if (data.cost !== undefined) this._cost = data.cost
		if (data.price !== undefined) this._price = data.price
		if (data.duration !== undefined) this._duration = data.duration

		this.save()

		return !returnApiResponse ? this
			: apiResponse(200, code, true, 'Package updated successfully.', this, 'package_update')
	}

	/** Save the current Package instance to the database.
	 * 
	 * @param returnApiResponse Whether to return an ApiResponse or the Package instance. (default: `false`)
	 * @returns The saved Package instance or an ApiResponse indicating the result of the operation.
	 */
	async save(returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
		const code = 'SAVE_PACKAGE_INSTANCE'

		// Find the index of this package in the parent's packages array.
		const index = this.index

		if (index === -1) {
			const errorMsg = `Package id ${this._id} not found in parent service id ${this._parent.id}.`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(400, code, false, errorMsg, { package: this.toJSON(), parentService: this._parent.toJSON() }, 'package_save')
		}

		// Update the package in the parent's packages array.
		this._parent.packages[index] = this

		// Save the updated parent service to the database.
		const parentSaveResult = await this._parent.save(true) as ApiResponse

		if (!parentSaveResult.passed) {
			const errorMsg = `Failed to save parent service (${this._parent.id}) while saving package (${this._id}).`
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { package: this.toJSON(), parentService: this._parent.toJSON() }, 'package_save')
		}

		// Return the result.
		return this
	}

	/** Convert the Package instance to a plain object. */
	toJSON(): PackageType {
		return {
			id: this._id,
			name: this._name,
			description: this._description,
			cost: this._cost,
			price: this._price,
			duration: this._duration
		}
	}

	/** Get a string representation of the Package instance. */
	toString(): string {
		return `Service Package: ${this._name} (${this._id})`
	}

	/** Get a detailed string representation of the Package instance. */
	toRepr(): string {
		return `Service.Package (id=${this._id}, name=${this._name}, description=${this._description}, cost=${this._cost}, price=${this._price}, duration=${this._duration})`
	}

	// #endregion Properties



	///////////////////////////////
	/// DATA VALIDATION METHODS ///
	///////////////////////////////
	// #region Data Validation

	static validate(values: Record<string, any>, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE'

		const validValues: Record<string, any> = {}
		const options = {
			id: Package.validateId,
			name: Package.validateName,
			description: Package.validateDescription,
			cost: Package.validateCost,
			price: Package.validatePrice,
			duration: Package.validateDuration,
		} as Record<string, (value: any, returnApiResponse: boolean) => any>

		// Validate each provided value using the corresponding validation function.
		for (const [oKey, oValue] of Object.entries(values)) {
			const validateFn = options[oKey]
			if (!validateFn)
				return !returnApiResponse ? false
					: apiResponse(400, code, false, `Validation function for ${oKey} not found.`, { [oKey]: oValue }, 'package')

			const key = oKey as keyof Record<string, any>

			const result = validateFn(oValue, returnApiResponse)
			if (!result.passed) return result

			validValues[key] = result.data[key]
		}

		// All values are valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package data is valid.', validValues as Partial<Package>, 'package')
	}

	static validateId(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE_ID'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Package id must be a string.', { id: value }, 'package_id')

		// Trim the value and set to id.
		const id = value.trim() as string

		// Check that id a valid MongoDB ObjectId.
		const objectIdRegex = /^[0-9a-fA-F]{24}$/
		if (!objectIdRegex.test(id))
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Package id must be a valid MongoDB ObjectId.', { id }, 'package_id')

		// Id is valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package id is valid.', { id }, 'package_id')
	}

	static validateName(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE_NAME'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Package name must be a string.', { name: value }, 'package_name')

		// Trim the value and set to name.
		const name = value.trim() as string

		// Validate name length.
		if (name.length === 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Package name cannot be empty.', { name }, 'package_name')

		const minLength = 3
		if (name.length < minLength)
			return !returnApiResponse ? false
				: apiResponse(402, code, false, `Package name must be at least ${minLength} characters long.`, { name }, 'package_name')

		const maxLength = 100
		if (name.length > maxLength)
			return !returnApiResponse ? false
				: apiResponse(403, code, false, `Package name must be no more than ${maxLength} characters long.`, { name }, 'package_name')

		// Name is valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package name is valid.', { name }, 'package_name')
	}

	static validateDescription(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE_DESCRIPTION'

		// Check that the value is a string.
		if (typeof value !== 'string')
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Package description must be a string.', { description: value }, 'package_description')

		// Trim the value and set to description.
		const description = value.trim() as string

		// Validate description length.
		if (description.length === 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Package description cannot be empty.', { description }, 'package_description')

		const minLength = 10
		if (description.length < minLength)
			return !returnApiResponse ? false
				: apiResponse(402, code, false, `Package description must be at least ${minLength} characters long.`, { description }, 'package_description')

		const maxLength = 500
		if (description.length > maxLength)
			return !returnApiResponse ? false
				: apiResponse(403, code, false, `Package description must be no more than ${maxLength} characters long.`, { description }, 'package_description')

		// Description is valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package description is valid.', { description }, 'package_description')
	}

	static validateCost(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE_COST'

		// Attempt to parse it as a float.
		const cost = typeof value === 'string' ? parseFloat(value) : value

		// Check that cost is a non-negative number.
		if (typeof cost !== 'number' || isNaN(cost))
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Package cost must be a non-negative number.', { cost: value }, 'package_cost')

		// Check that cost is non-negative.
		if (cost < 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Package cost cannot be negative.', { cost }, 'package_cost')

		// Cost is valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package cost is valid.', { cost }, 'package_cost')
	}

	static validatePrice(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE_PRICE'

		// Attempt to parse it as a float.
		const price = typeof value === 'string' ? parseFloat(value) : value

		// Check that price is a non-negative number.
		if (typeof price !== 'number' || isNaN(price))
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Package price must be a non-negative number.', { price: value }, 'package_price')

		// Check that price is non-negative.
		if (price < 0)
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Package price cannot be negative.', { price }, 'package_price')

		// Price is valid.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package price is valid.', { price }, 'package_price')
	}

	static validateDuration(value: any, returnApiResponse: boolean = true) {
		const code = 'VALIDATE_PACKAGE_DURATION'

		// Attempt to parse it as an integer.
		const duration = typeof value === 'string' ? parseInt(value) : value

		// Check that duration is a number.
		if (typeof duration !== 'number' || isNaN(duration))
			return !returnApiResponse ? false
				: apiResponse(400, code, false, 'Package duration must be a number.', { duration: value }, 'package_duration')

		// Check that duration is an integer.
		if (!Number.isInteger(duration))
			return !returnApiResponse ? false
				: apiResponse(401, code, false, 'Package duration must be an integer.', { duration }, 'package_duration')

		// Check that duration is non-negative.
		if (duration < 0)
			return !returnApiResponse ? false
				: apiResponse(402, code, false, 'Package duration cannot be negative.', { duration }, 'package_duration')

		// Duration is valid.
		return apiResponse(200, code, true, 'Package duration is valid.', { duration }, 'package_duration')
	}

	// #endregion Data Validation
}

// #endregion Package Class



//////////////////////
/// PACKAGES CLASS ///
//////////////////////
// #region Packages Class

class Packages {
	private _parent: Service
	private _items: Package[]

	constructor(parent: Service, items: PackageType[]) {
		this._parent = parent
		this._items = items.map(item => new Package(parent, item))
	}

	get items(): PackageType[] {
		return [...this._items]
	}

	get(idOrindex: string | number): Package | null {
		const index = typeof idOrindex === 'number' ? idOrindex
			: this._items.findIndex(pkg => pkg.id === idOrindex)

		if (index < 0 || index >= this._items.length) return null

		return this._items[index]
	}

	async find(data: Partial<Ranged<Queryable<PackageType, 'id'>, 'cost' | 'price' | 'duration'>>, returnApiResponse: boolean = true) : Promise<Package[] | ApiResponse> {
		const code = 'FIND_PACKAGE'

		// Find the package based on provided data.
		const found = this._items.filter(pkg => {
			if (data.id !== undefined && (Array.isArray(data.id) ? !data.id.includes(pkg.id) : pkg.id !== data.id)) return false
			if (data.name !== undefined && pkg.name.toLowerCase().indexOf(data.name.toLowerCase()) === -1) return false
			if (data.description !== undefined && pkg.description.toLowerCase().indexOf(data.description.toLowerCase()) === -1) return false
			if (data.cost !== undefined)
				if (pkg.cost !== data.cost) return false
			else {
				if (data.minCost !== undefined && pkg.cost < data.minCost) return false
				if (data.maxCost !== undefined && pkg.cost > data.maxCost) return false
			}
			if (data.price !== undefined)
				if (pkg.price !== data.price) return false
			else {
				if (data.minPrice !== undefined && pkg.price < data.minPrice) return false
				if (data.maxPrice !== undefined && pkg.price > data.maxPrice) return false
			}
			if (data.duration !== undefined)
				if (pkg.duration !== data.duration) return false
			else {
				if (data.minDuration !== undefined && pkg.duration < data.minDuration) return false
				if (data.maxDuration !== undefined && pkg.duration > data.maxDuration) return false
			}
			return true
		})

		// Return the result.
		return !returnApiResponse ? found 
			: apiResponse(200, code, true, 'Package found successfully.', found, 'service_find_package')
	}

	async add(data: Optional<PackageType, 'id'>, returnApiResponse: boolean = true) : Promise<Package | ApiResponse> {
		const code = 'ADD_PACKAGE'

		// Validate the package data.
		const validationResult = Package.validate(data, true) as ApiResponse
		if (!validationResult.passed) {
			if (!returnApiResponse) throw new Error(validationResult.message)
			return validationResult
		}

		data = validationResult.data as Optional<PackageType, 'id'>

		// Create the new package and add it to the service.
		const newPackage = new Package(this._parent, data)
		this._items.push(newPackage)

		// Save the updated service.
		const updatedServiceResponse = await this._parent.save(true) as ApiResponse

		if (!updatedServiceResponse.passed) {
			if (!returnApiResponse) throw new Error(updatedServiceResponse.message)
			return updatedServiceResponse
		}

		// Return the result.
		return !returnApiResponse ? newPackage
			: apiResponse(200, code, true, 'Package added to service successfully.', newPackage, 'service_add_package')
	}

	async update(idOrIndex: string | number, packageData: Partial<Omit<PackageType, 'id'>>, returnApiResponse: boolean = true) : Promise<Package | ApiResponse> {
		const code = 'UPDATE_PACKAGE'

		// Find the package to update.
		if (typeof idOrIndex === 'string') {
			idOrIndex = this._items.findIndex(pkg => pkg.id === idOrIndex)

			if (idOrIndex === -1) {
				const errorMsg = 'Package with specified id not found.'
				if (!returnApiResponse) throw new Error(errorMsg)
				return apiResponse(400, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_update_package')
			}
		}

		const packageIndex = idOrIndex as number

		if (packageIndex < 0 || packageIndex >= this._items.length) {
			const errorMsg = 'Package index out of bounds.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_update_package')
		}

		const currentPackage = this._items[packageIndex]

		// Update the package in the current instance.
		const updateResult = await currentPackage.update(packageData, true) as ApiResponse

		if (!updateResult.passed) {
			if (!returnApiResponse) throw new Error(updateResult.message)
			return updateResult
		}

		// Return the result.
		return !returnApiResponse ? currentPackage : updateResult
	}

	async remove(idOrIndex: string | number, returnApiResponse: boolean = true) : Promise<boolean | ApiResponse> {
		const code = 'REMOVE_PACKAGE'

		// Find the package to remove.
		if (typeof idOrIndex === 'string') {
			idOrIndex = this._items.findIndex(pkg => pkg.id === idOrIndex)

			if (idOrIndex === -1) {
				const errorMsg = 'Package with specified id not found.'
				if (!returnApiResponse) throw new Error(errorMsg)
				return apiResponse(400, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_remove_package')
			}
		}

		const packageIndex = idOrIndex as number

		if (packageIndex < 0 || packageIndex >= this._items.length) {
			const errorMsg = 'Package index out of bounds.'
			if (!returnApiResponse) throw new Error(errorMsg)
			return apiResponse(401, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_remove_package')
		}
		
		this._items.splice(packageIndex, 1)

		// Save the updated service.
		const updatedServiceResponse = await this._parent.save(true) as ApiResponse

		if (!updatedServiceResponse.passed) {
			if (!returnApiResponse) throw new Error(updatedServiceResponse.message)
			return updatedServiceResponse
		}

		// Return the result.
		return !returnApiResponse ? true
			: apiResponse(200, code, true, 'Package removed from service successfully.', { id: this._parent.id, packageIndex }, 'service_remove_package')
	}

	toJSON(): PackageType[] {
		return this._items.map(pkg => pkg.toJSON())
	}

	toString(): string {
		return `Service Packages: ${this._items.length} items`
	}

	toRepr(): string {
		return `Service.Packages (serviceId=${this._parent.id}, items=[${this._items.map(pkg => pkg.toJSON()).join(', ')}])`
	}
}

// #endregion Packages Class

export default Service