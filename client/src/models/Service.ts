import { SectionList, type SectionType } from "../components/section/component.section"
import type { Flatten, Optional, Queryable, Replace } from "../lib/customUtilityTypes"
import { generateId, getImagePath } from "../lib/utils"

////////////////////////
/// MODEL INTERFACES ///
////////////////////////
// #region Interfaces

export interface ServiceType {
	/** The unique identifier of the service. */
	id: string

	/** The unique key of the service. */
	key: string

	/** The name of the service. */
	name: string

	/** A brief description of the service. */
	description: string

	/** The URL of the image representing the service. */
	imageUrl: string

	/** Whether to feature this service on the home page. */
	topService?: boolean

	/** The detailed sections for the service page. */
	details: SectionList
}

type FilterType = Partial<
	Queryable<
		Omit<ServiceType, 'details'> & Flatten<
			SectionType, 'details'
		>, 'id'
	>
>

// #endregion Interfaces



/////////////////////
/// SERVICE CLASS ///
/////////////////////
// #region Service Class

class ServiceInfo implements ServiceType {
	private _id: string
	private _key: string
	private _name: string
	private _description: string
	private _imageUrl: string
	private _topService: boolean
	private _details: SectionList

	constructor(data: Optional<Replace<ServiceType, 'details', SectionType[]>, 'id' | 'key'>) {
		this._id = data.id || generateId()
		this._name = data.name
		this._key = (data.key || this._name).toLowerCase().replace(/\s+/g, '-')
		this._description = data.description
		this._imageUrl = data.imageUrl
		this._topService = data.topService || false
		this._details = new SectionList(data.details)
	}

	/** The unique identifier of the service. */
	get id() { return this._id }

	/** The unique key of the service. */
	get key() { return this._key }
	set key(value: string) { this._key = value }

	/** The name of the service. */
	get name() { return this._name }
	set name(value: string) { this._name = value }

	/** A brief description of the service. */
	get description() { return this._description }
	set description(value: string) { this._description = value }

	/** The image URL for the service. */
	get imageUrl() { return this._imageUrl }
	set imageUrl(value: string) { this._imageUrl = value }

	/** Whether this service is featured on the home page. */
	get topService() { return this._topService }
	set topService(value: boolean) { this._topService = value }

	/** The detailed sections for the service page. */
	get details() { return this._details }

	//////////////////////
	/// STATIC METHODS ///
	//////////////////////
	// #region Static Methods

	static async find(filters?: FilterType): Promise<ServiceInfo[]> {
		// TODO: Implement API call to fetch services based on filters.
		return await findService(filters)
	}

	// #endregion Static Methods
}

// #endregion Service Class

export default ServiceInfo

// TODO: Replace with API data
const serviceExamples: ServiceInfo[] = [
	new ServiceInfo({
		name: 'Physical Therapy',
		description: 'Comprehensive physical therapy services to help you recover and thrive.',
		imageUrl: '/images/services/physical-therapy.jpg',
		topService: false,
		details: [
			{
				label: 'Treatment',
				title: 'Personalized Treatment Plans',
				content: 'Our physical therapists create customized treatment plans tailored to your specific needs and goals.\nWe focus on restoring function, reducing pain, and improving mobility.',
				imageUrl: '/images/services/physical-therapy-1.jpg'
			},
			{
				label: 'Benefits',
				title: 'Benefits of Physical Therapy',
				content: 'Physical therapy can help you recover from injuries, manage chronic conditions, and enhance overall well-being.\nExperience improved strength, flexibility, and quality of life.',
				imageUrl: '/images/services/physical-therapy-2.jpg'
			}
		]
	}),

	new ServiceInfo({
		name: 'Massage Therapy',
		description: 'Relaxing and therapeutic massage services to rejuvenate your body and mind.',
		imageUrl: '/images/services/massage-therapy.jpg',
		topService: false,
		details: [
			{
				label: 'Techniques',
				title: 'Variety of Massage Techniques',
				content: 'We offer a range of massage techniques including Swedish, deep tissue, and sports massage to address your unique needs.\nOur skilled therapists will help you relax and relieve tension.',
				imageUrl: '/images/services/massage-therapy-1.jpg'
			},
			{
				label: 'Wellness',
				title: 'Enhance Your Wellness',
				content: 'Massage therapy promotes relaxation, reduces stress, and improves circulation.\nExperience the benefits of regular massage for your overall health and well-being.',
				imageUrl: '/images/services/massage-therapy-2.jpg'
			},
			{
				label: 'Benefits',
				title: 'Benefits of Massage Therapy',
				content: 'Massage therapy can alleviate muscle tension, reduce pain, and enhance mental clarity.\nIncorporate massage into your wellness routine for lasting benefits.',
				imageUrl: '/images/services/massage-therapy-3.jpg'
			}
		]
	}),

	new ServiceInfo({
		name: 'Botox Treatments',
		description: 'Professional Botox treatments to help you look and feel your best.',
		imageUrl: getImagePath('service - woman getting botox.png'),
		topService: true,
		details: [
			{
				label: 'Treatment',
				title: 'Expert Botox Treatments',
				content: `
                    These injectable neuromodulators - including Botox®, Dysport®, and Daxxify™ - rank among our most sought-after aesthetic treatments. Derived from purified botulinum toxin, these FDA-approved formulations work by temporarily relaxing targeted facial muscles when administered at therapeutic doses, resulting in visibly smoother skin and a more refreshed appearance.
                    Treatment involves precise injections into specific facial muscles, most commonly addressing expression lines in the upper face such as forehead creases, glabellar lines (between the brows), and crow's feet around the eyes. It's worth noting that these dynamic wrinkles aren't exclusively age-related - they can appear in younger individuals due to habitual facial expressions like frowning, squinting, or raising eyebrows.
                    Our experienced practitioners use ultra-fine needles for minimal discomfort during the quick 10-15 minute procedure, which typically requires no numbing agent. Results gradually appear over 2-14 days as the treatment takes effect, with visible improvements lasting approximately 3-4 months for Botox® and Dysport®, while Daxxify™ may provide benefits extending up to 6-9 months.
				`,
				imageUrl: getImagePath('service - botox img 1.png')
			},
			{
				label: 'Results',
				title: 'Achieve Youthful Results',
				content: `
					To minimize bruising risk, we suggest avoiding alcohol consumption in the 24 hours before your appointment and discontinuing aspirin or anti-inflammatory medications such as ibuprofen 4-7 days beforehand (unless prescribed for medical conditions like cardiovascular health). We also recommend beginning homeopathic Arnica Montana supplementation at least 3 days prior to treatment.
					At Harmony Health, we recognize that each person's aesthetic aspirations are unique. Our commitment is to provide customized treatment plans tailored specifically to your individual needs and desired outcomes.
					Ready to begin your aesthetic journey? Reach out to Harmony Health today to book your personalized consultation and discover how we can help you achieve your beauty goals.
				`,
				imageUrl: [
					getImagePath('service - botox img 2-1.png'),
					getImagePath('service - botox img 2-2.png')
				]
			}
		]
	}),

	new ServiceInfo({
		name: 'Dermal Fillers',
		description: 'Enhance your natural beauty with our professional dermal filler treatments.',
		imageUrl: getImagePath('service - woman getting fillers.png'),
		topService: true,
		details: [
			{
				label: 'Enhancement',
				title: 'Natural Enhancement',
				content: 'Our dermal filler treatments are designed to enhance your natural features and restore volume.\nWe use high-quality fillers to achieve subtle, beautiful results.',
				imageUrl: '/images/services/dermal-fillers-1.jpg'
			},
			{
				label: 'Benefits',
				title: 'Benefits of Dermal Fillers',
				content: 'Dermal fillers can smooth wrinkles, enhance lips, and contour facial features.\nExperience a refreshed and youthful appearance with our expert treatments.',
				imageUrl: '/images/services/dermal-fillers-2.jpg'
			}
		]
	}),

	new ServiceInfo({
		name: 'Microdermabrasion',
		description: 'Revitalize your skin with our professional microdermabrasion treatments.',
		imageUrl: getImagePath('service - woman getting microneedling.png'),
		topService: true,
		details: [
			{
				label: 'Procedure',
				title: 'Gentle Exfoliation',
				content: 'Our microdermabrasion treatments gently exfoliate the skin, removing dead skin cells and promoting cell turnover.\nExperience smoother, brighter skin with our expert care.',
				imageUrl: '/images/services/microdermabrasion-1.jpg'
			},
			{
				label: 'Benefits',
				title: 'Benefits of Microdermabrasion',
				content: 'Microdermabrasion can improve skin texture, reduce fine lines, and minimize pores.\nIncorporate this treatment into your skincare routine for a radiant complexion.',
				imageUrl: '/images/services/microdermabrasion-2.jpg'
			}
		]
	}),
]

async function findService(filters?: FilterType) {
	if (!filters) return serviceExamples

	const services = serviceExamples.filter(service => {
		for (const key in filters) {
			const fKey = key as keyof FilterType
			const sKey = key as keyof ServiceType
			if (service[sKey] !== filters[fKey]) return false
		}
		return true
	})
	return services
}




























// import { type ApiResponse, apiResponse } from "../lib/apiResponse"
// import { api } from "../lib/api"
// import type { ElementType, Flatten, Optional, Queryable, Ranged } from "../lib/customUtilityTypes"
// import mongoose from "mongoose"



// ////////////////////////
// /// MODEL INTERFACES ///
// ////////////////////////
// // #region Interfaces

// export interface ServiceType {
// 	id: string
// 	name: string
// 	description: string
// 	details: string
// 	sortOrder: number
// 	topService: boolean
// 	packages: {
// 		id: string
// 		name: string
// 		description: string
// 		cost: number
// 		price: number
// 		duration: number
// 	}[]
// }

// type packagesType = ServiceType['packages']
// type PackageType = ElementType<packagesType>

// type FilterType = Partial<
// 	Queryable<
// 		Omit<ServiceType, 'packages'> & Flatten<
// 			Ranged<
// 				PackageType,
// 				'cost' | 'price' | 'duration'
// 			>, 'package'
// 		>, 'id' | 'package_id'
// 	>
// >

// type InputType = Omit<
// 	Optional<
// 		ServiceType,
// 		'id' | 'sortOrder'
// 	>, 'packages'
// > & {
// 	packages: Optional<PackageType, 'id'>[]
// }

// type UpdateType = Partial<Omit<ServiceType, 'id'>>

// // #endregion Interfaces



// /////////////////////
// /// SERVICE CLASS ///
// /////////////////////
// // #region Service Class

// /**
//  * Service Model class
//  *
//  * Represents a service offered by the business, including its packages.
//  *
//  * Properties:
//  * - id: Unique identifier for the service
//  * - name: Name of the service
//  * - description: Brief description of the service
//  * - details: Detailed information about the service
//  * - sortOrder: Order in which the service is displayed
//  * - topService: Indicates if the service is a top service
//  * - packages: Array of packages under this service
//  * > - id: Unique identifier for the package
//  * > - name: Name of the package
//  * > - description: Description of the package
//  * > - cost: The approximate cost of the package to the provider
//  * > - price: The price charged to the customer for the package
//  * > - duration: Duration of the package in minutes
//  * Methods:
//  * - static find(filters?: Filters): Promise<Service[]>
//  * - static insert(data: Omit<Service, 'id'>): Promise<Service>
//  * - static update(id: string, data: Partial<Omit<Service, 'id'>>): Promise<Service | null>
//  * - static delete(id: string): Promise<boolean>
//  */
// class Service implements ServiceType {

// 	//////////////////
// 	/// PROPERTIES ///
// 	//////////////////
// 	// #region Properties

// 	private _id: string
// 	private _name: string
// 	private _description: string
// 	private _details: string
// 	private _sortOrder: number
// 	private _topService: boolean
// 	private _packages: Packages

// 	private _errors: Partial<Record<keyof ServiceType, ApiResponse>> = {}

// 	constructor(data: ServiceType) {
// 		this._id = data.id
// 		this._name = data.name
// 		this._description = data.description
// 		this._details = data.details
// 		this._sortOrder = data.sortOrder
// 		this._topService = data.topService
// 		this._packages = new Packages(this, data.packages)
// 	}

// 	/** The unique identifier of the service. */
// 	get id() { return this._id }

// 	/** The name of the service. */
// 	get name() { return this._name }
// 	set name(value: string) {
// 		this._name = value

// 		Service.validate({ name: value }).then((res) => {
// 			this._errors['name'] = res.passed ? undefined : res
// 		})
// 	}

// 	/** A brief description of the service. */
// 	get description() { return this._description }
// 	set description(value: string) {
// 		this._description = value

// 		Service.validate({ description: value }).then((res) => {
// 			this._errors['description'] = res.passed ? undefined : res
// 		})
// 	}

// 	/** Detailed information about the service.
// 	 * - This can use markdown formatting. */
// 	get details() { return this._details }
// 	set details(value: string) {
// 		this._details = value

// 		Service.validate({ details: value }).then((res) => {
// 			this._errors['details'] = res.passed ? undefined : res
// 		})
// 	}

// 	/** The display order of the service. */
// 	get sortOrder() { return this._sortOrder }
// 	set sortOrder(value: number) {
// 		this._sortOrder = value

// 		Service.validate({ sortOrder: value }).then((res) => {
// 			this._errors['sortOrder'] = res.passed ? undefined : res
// 		})
// 	}

// 	/** Whether the service is marked as a top service. */
// 	get topService() { return this._topService }
// 	set topService(value: boolean) {
// 		this._topService = value

// 		Service.validate({ topService: value }).then((res) => {
// 			this._errors['topService'] = res.passed ? undefined : res
// 		})
// 	}

// 	/** The packages associated with the service. */
// 	get packages() { return this._packages.toJSON() }
// 	/** Set the packages associated with the service.
// 	 * - This will replace all existing packages.
// 	 */
// 	set packages(value: PackageType[]) {
// 		this._packages = new Packages(this, value)

// 		Service.validate({ packages: value }).then((res) => {
// 			this._errors['packages'] = res.passed ? undefined : res
// 		})
// 	}


// 	/**
// 	 * Update the service with the provided data.
// 	 *
// 	 * @param data Partial data to update the service.
// 	 * - name: string (optional) - The name of the service.
// 	 * - description: string (optional) - A brief description of the service.
// 	 * - details: string (optional) - Detailed information about the service.
// 	 * - sortOrder: number (optional) - The display order of the service.
// 	 * - topService: boolean (optional) - Whether the service is marked as a top service.
// 	 * - packages: Package[] (optional) - The packages associated with the service. This will replace all existing packages.
// 	 * > - name: string - The name of the package.
// 	 * > - description: string - A brief description of the package.
// 	 * > - cost: number - The approximate cost of the package to the provider.
// 	 * > - price: number - The price charged to the customer for the package.
// 	 * > - duration: number - The duration of the package in minutes.
// 	 * @param returnApiResponse Whether to return the updated service or an ApiResponse.
// 	 * @returns The updated Service instance or an ApiResponse indicating success or failure.
// 	 */
// 	async update(data: UpdateType, returnApiResponse: boolean = true): Promise<Service | ApiResponse> {
// 		// Send the update request to the API.
// 		const response = await api.put('service', { id: this._id, data, returnApiResponse }) as ApiResponse

// 		// If the update failed, throw an error or return the response.
// 		if (!response.passed) {
// 			if (!returnApiResponse) throw new Error(response.message)
// 			return response
// 		}

// 		// Update the current instance with the returned data.
// 		const updated = response.data as Service
// 		this._name = updated.name
// 		this._description = updated.description
// 		this._details = updated.details
// 		this._sortOrder = updated.sortOrder
// 		this._topService = updated.topService
// 		this._packages = new Packages(this, updated.packages)

// 		// Return the updated instance or the response.
// 		return !returnApiResponse ? this : response
// 	}

// 	/**
// 	 * Save the current service instance to the database.
// 	 *
// 	 * @param returnApiResponse Whether to return the saved service or an ApiResponse.
// 	 * @returns The saved Service instance or an ApiResponse indicating success or failure.
// 	 */
// 	async save(returnApiResponse: boolean = true): Promise<Service | ApiResponse> {
// 		return this.update(this.toJSON(), returnApiResponse)
// 	}

// 	/**
// 	 * Reset the service instance to the latest data from the database.
// 	 *
// 	 * @param returnApiResponse Whether to return the reset service or an ApiResponse.
// 	 * @returns The reset Service instance or an ApiResponse indicating success or failure.
// 	 */
// 	async reset(returnApiResponse: boolean = true): Promise<Service | ApiResponse> {
// 		const response = await Service.find({ id: this._id }, true) as ApiResponse
// 		if (!response.passed) {
// 			if (!returnApiResponse) throw new Error(response.message)
// 			return response
// 		}

// 		const reset = (response.data as Service[])[0]
// 		this._name = reset.name
// 		this._description = reset.description
// 		this._details = reset.details
// 		this._sortOrder = reset.sortOrder
// 		this._topService = reset.topService
// 		this._packages = new Packages(this, reset.packages)
// 		return !returnApiResponse ? this : response
// 	}

// 	/**
// 	 * Delete the current service instance from the database.
// 	 *
// 	 * @param returnApiResponse Whether to return a boolean or an ApiResponse.
// 	 * @returns True if deletion was successful, false otherwise, or an ApiResponse.
// 	 */
// 	async delete(returnApiResponse: boolean = true): Promise<boolean | ApiResponse> {
// 		const response = await api.delete('service', { id: this._id, returnApiResponse }) as ApiResponse

// 		if (!response.passed) {
// 			if (!returnApiResponse) throw new Error(response.message)
// 			return response
// 		}

// 		return !returnApiResponse ? true : response
// 	}

// 	/** Convert the service instance to a plain object. */
// 	toJSON(): ServiceType {
// 		return {
// 			id: this._id,
// 			name: this._name,
// 			description: this._description,
// 			details: this._details,
// 			sortOrder: this._sortOrder,
// 			topService: this._topService,
// 			packages: this._packages.toJSON()
// 		}
// 	}

// 	/** Short string representation of the service instance. */
// 	toString(): string {
// 		return `Service: '${this._name}' ('${this._id}')`
// 	}

// 	/** Detailed string representation of the service instance. */
// 	toRepr(): string {
// 		return `Service { id: ${this._id}, name: ${this._name}, description: ${this._description}, details: ${this._details}, sortOrder: ${this._sortOrder}, topService: ${this._topService}, packages: [${this._packages.toJSON()}] }`
// 	}

// 	// #endregion Properties


// 	//////////////////////
// 	/// STATIC METHODS ///
// 	//////////////////////
// 	// #region Static Methods

// 	/**
// 	 * Find services based on provided filters.
// 	 *
// 	 * @param filters Optional filters to apply to the search. If omitted, all services are returned.
// 	 * Filter options include:
// 	 * - `id`: string | string[] - Unique identifier(s) of the service
// 	 * - `name`: string - Name of the service (to match partially, case-insensitive)
// 	 * - `description`: string - Description of the service (to match partially, case-insensitive)
// 	 * - `details`: string - Details of the service (to match partially, case-insensitive)
// 	 * - `topService`: boolean - Whether the service is a top service
// 	 * - `package_id`: string | string[] - Unique identifier(s) of the package
// 	 * - `package_name`: string - Name of the package (to match partially, case-insensitive)
// 	 * - `package_description`: string - Description of the package (to match partially, case-insensitive)
// 	 * - `package_cost`: number - Exact cost of the package
// 	 * - `package_minCost`: number - Minimum cost of the package if no exact cost is provided
// 	 * - `package_maxCost`: number - Maximum cost of the package if no exact cost is provided
// 	 * - `package_price`: number - Price of the package (to match partially, case-insensitive)
// 	 * - `package_minPrice`: number - Minimum price of the package if no exact price is provided
// 	 * - `package_maxPrice`: number - Maximum price of the package if no exact price is provided
// 	 * - `package_duration`: number - Exact duration of the package in minutes
// 	 * - `package_minDuration`: number - Minimum duration of the package in minutes if no exact duration is provided
// 	 * - `package_maxDuration`: number - Maximum duration of the package in minutes if no exact duration is provided
// 	 * @param returnApiResponse Whether to return the services or an ApiResponse.
// 	 * @returns Promise resolving to an array of Service instances matching the filters.
// 	 *
// 	 * @example
// 	 * // Find all services
// 	 * const allServices = await Service.find()
// 	 *
// 	 * // Find services with name containing "therapy"
// 	 * const therapyServices = await Service.find({ name: 'therapy' })
// 	 *
// 	 * // Find top services with package cost between 100 and 500
// 	 * const topCostlyServices = await Service.find({ topService: true, package_minCost: 100, package_maxCost: 500 })
// 	 */
// 	static async find(filters?: FilterType, returnApiResponse: boolean = true): Promise<Service[] | ApiResponse> {
// 		// Send the find request to the API.
// 		const response = await api.get('service', { filters, returnApiResponse }) as ApiResponse

// 		// If the find failed, throw an error or return the response.
// 		if (!response.passed) {
// 			if (!returnApiResponse) throw new Error(response.message)
// 			return response
// 		}

// 		// Map the returned data to Service instances.
// 		const services = (response.data as ServiceType[]).map(data => new Service(data))

// 		// Return the services or the response.
// 		if (!returnApiResponse) return services
// 		response.data = services
// 		return response
// 	}

// 	/**
// 	 * Insert a new service into the database.
// 	 *
// 	 * @param data Data for the new service:
// 	 * - id: string (optional) - Unique identifier for the service. If not provided, it will be auto-generated.
// 	 * - name: string - Name of the general service.
// 	 * - description: string - Description of the general service.
// 	 * - details: string - Detailed information about the general service. Use Markdown formatting if needed.
// 	 * - topService: boolean - Whether the service should be marked listed as a top service.
// 	 * - packages: Packages[] - Array of packages under this general service.
// 	 * > - id: string (optional) - Unique identifier for the package. If not provided, it will be auto-generated.
// 	 * > - name: string - Name of the package.
// 	 * > - description: string - Description of the package.
// 	 * > - cost: number - Cost of the package to the provider.
// 	 * > - price: number - Price of the package charged to the customer.
// 	 * > - duration: number - Duration of the package in minutes.
// 	 * @param returnApiResponse Whether to return the inserted service or an ApiResponse.
// 	 */
// 	static async insert(data: InputType, returnApiResponse: boolean = true): Promise<Service | ApiResponse> {
// 		const response = await api.post('service', { data, returnApiResponse }) as ApiResponse

// 		if (!response.passed) {
// 			if (!returnApiResponse) throw new Error(response.message)
// 			return response
// 		}

// 		const inserted = new Service(response.data as ServiceType)

// 		if (!returnApiResponse) return inserted
// 		response.data = inserted
// 		return response
// 	}

// 	// /**
// 	//  * Find a package within a service by package data.
// 	//  *
// 	//  * @param serviceId The id of the service to search within.
// 	//  * @param packageData The package data to search for:
// 	//  * - id: string (optional) - The unique identifier of the package.
// 	//  * - name: string (optional) - The name of the package (to match partially, case-insensitive).
// 	//  * - description: string (optional) - The description of the package (to match partially, case-insensitive).
// 	//  * - cost: number | { min?: number; max?: number } (optional) - The cost of the package or a range to search within.
// 	//  * - price: number | { min?: number; max?: number } (optional) - The price of the package or a range to search within.
// 	//  * - duration: number | { min?: number; max?: number } (optional) - The duration of the package in minutes or a range to search within.
// 	//  * @param returnApiResponse Whether to return the found package or an ApiResponse.
// 	//  * @returns The found Package instance or an ApiResponse indicating success or failure.
// 	//  */
// 	// static async findPackage(serviceId: string, packageData: Partial<Ranged<Queryable<PackageType, 'id'>, 'cost' | 'price' | 'duration'>>, returnApiResponse: boolean = true): Promise<PackageType | ApiResponse> {
// 	// 	const code = 'SERVICE_FIND_PACKAGE'

// 	// 	// Find the service instance.
// 	// 	const serviceInstance = await Service.find({ id: serviceId }, true) as ApiResponse

// 	// 	if (!serviceInstance.passed) {
// 	// 		if (!returnApiResponse) throw new Error(serviceInstance.message)
// 	// 		return serviceInstance
// 	// 	}

// 	// 	const service = (serviceInstance.data as Service[])[0]

// 	// 	// Use the instance's packages to find the package.
// 	// 	const response = await service._packages.find(packageData, true) as ApiResponse

// 	// 	if (!response.passed) {
// 	// 		if (!returnApiResponse) throw new Error(response.message)
// 	// 		return response
// 	// 	}

// 	// 	const found = response.data as ApiResponse

// 	// 	// Return the found package.
// 	// 	return !returnApiResponse ? found
// 	// 		: apiResponse(200, code, true, 'Package found successfully.', found, 'service_find_package')
// 	// }

// 	// /**
// 	//  * Add a new package to a service.
// 	//  *
// 	//  * @param serviceId The id of the service to add the package to.
// 	//  * @param packageData The data for the new package:
// 	//  * - id: string (optional) - The unique identifier of the package. If not provided, a new id will be generated.
// 	//  * - name: string - The name of the package.
// 	//  * - description: string - A brief description of the package.
// 	//  * - cost: number - The approximate cost of the package to the provider.
// 	//  * - price: number - The price charged to the customer for the package.
// 	//  * - duration: number - The duration of the package in minutes.
// 	//  * @param returnApiResponse Whether to return the added package or an ApiResponse.
// 	//  * @returns The added Package instance or an ApiResponse indicating success or failure.
// 	//  */
// 	// static async addPackage(serviceId: string, packageData: Optional<PackageType, 'id'>, returnApiResponse: boolean = true): Promise<PackageType | ApiResponse> {
// 	// 	const code = 'SERVICE_ADD_PACKAGE'

// 	// 	// Find the service instance.
// 	// 	const serviceInstance = await Service.find({ id: serviceId }, true) as ApiResponse
// 	// 	if (!serviceInstance.passed) {
// 	// 		if (!returnApiResponse) throw new Error(serviceInstance.message)
// 	// 		return serviceInstance
// 	// 	}

// 	// 	const service = (serviceInstance.data as Service[])[0]

// 	// 	// Use the instance's packages to add the package.
// 	// 	const response = await service._packages.add(packageData, true) as ApiResponse

// 	// 	if (!response.passed) {
// 	// 		if (!returnApiResponse) throw new Error(response.message)
// 	// 		return response
// 	// 	}

// 	// 	const added = response.data as PackageType

// 	// 	// Save the updated service.
// 	// 	const saveResult = await service.save(true) as ApiResponse

// 	// 	if (!saveResult.passed) {
// 	// 		if (!returnApiResponse) throw new Error(saveResult.message)
// 	// 		return saveResult
// 	// 	}

// 	// 	// Return the added package.
// 	// 	return !returnApiResponse ? added
// 	// 		: apiResponse(200, code, true, 'Package added successfully.', added, 'service_add_package')
// 	// }

// 	// /**
// 	//  * Update an existing package within a service.
// 	//  *
// 	//  * @param packageId The id of the package to update.
// 	//  * @param packageData The data to update the package:
// 	//  * - name: string (optional) - The name of the package.
// 	//  * - description: string (optional) - A brief description of the package.
// 	//  * - cost: number (optional) - The approximate cost of the package to the provider.
// 	//  * - price: number (optional) - The price charged to the customer for the package.
// 	//  * - duration: number (optional) - The duration of the package in minutes.
// 	//  * @param returnApiResponse Whether to return the updated package or an ApiResponse.
// 	//  * @returns The updated Package instance or an ApiResponse indicating success or failure.
// 	//  */
// 	// static async updatePackage(packageId: string, packageData: Partial<Omit<PackageType, 'id'>>, returnApiResponse: boolean = true): Promise<PackageType | ApiResponse> {
// 	// 	const code = 'SERVICE_UPDATE_PACKAGE'

// 	// 	// Find the service instance.
// 	// 	const serviceInstance = await Service.find({ 'package_id': packageId }, true) as ApiResponse

// 	// 	if (!serviceInstance.passed) {
// 	// 		if (!returnApiResponse) throw new Error(serviceInstance.message)
// 	// 		return serviceInstance
// 	// 	}

// 	// 	const service = (serviceInstance.data as Service[])[0]

// 	// 	// Use the instance's packages to update the package.
// 	// 	const response = await service._packages.update(packageId, packageData, true) as ApiResponse

// 	// 	if (!response.passed) {
// 	// 		if (!returnApiResponse) throw new Error(response.message)
// 	// 		return response
// 	// 	}

// 	// 	const updated = response.data as PackageType

// 	// 	// Save the updated service.
// 	// 	const saveResult = await service.save(true) as ApiResponse

// 	// 	if (!saveResult.passed) {
// 	// 		if (!returnApiResponse) throw new Error(saveResult.message)
// 	// 		return saveResult
// 	// 	}

// 	// 	// Return the updated package.
// 	// 	return !returnApiResponse ? updated
// 	// 		: apiResponse(200, code, true, 'Package updated successfully.', updated, 'service_update_package')
// 	// }

// 	// /**
// 	//  * Remove a package from a service by package id.
// 	//  *
// 	//  * @param packageId The id of the package to remove.
// 	//  * @param returnApiResponse Whether to return a boolean or an ApiResponse.
// 	//  * @returns True if removal was successful, false otherwise, or an ApiResponse.
// 	//  */
// 	// static async removePackage(packageId: string, returnApiResponse: boolean = true): Promise<boolean | ApiResponse> {
// 	// 	const code = 'SERVICE_REMOVE_PACKAGE'

// 	// 	// Find the service instance.
// 	// 	const serviceInstance = await Service.find({ 'package_id': packageId }, true) as ApiResponse

// 	// 	if (!serviceInstance.passed) {
// 	// 		if (!returnApiResponse) throw new Error(serviceInstance.message)
// 	// 		return serviceInstance
// 	// 	}

// 	// 	const service = (serviceInstance.data as Service[])[0]

// 	// 	// Use the instance's packages to remove the package.
// 	// 	const response = await service._packages.remove(packageId, true) as ApiResponse

// 	// 	if (!response.passed) {
// 	// 		if (!returnApiResponse) throw new Error(response.message)
// 	// 		return response
// 	// 	}

// 	// 	const removed = response.data as boolean

// 	// 	// Save the updated service.
// 	// 	const saveResult = await service.save(true) as ApiResponse

// 	// 	if (!saveResult.passed) {
// 	// 		if (!returnApiResponse) throw new Error(saveResult.message)
// 	// 		return saveResult
// 	// 	}

// 	// 	// Return the result.
// 	// 	return !returnApiResponse ? removed
// 	// 		: apiResponse(200, code, true, 'Package removed successfully.', { packageId, removed }, 'service_remove_package')
// 	// }

// 	static async validate(data: Partial<ServiceType>): Promise<ApiResponse> {
// 		return await api.get('service/validate', { data }) as ApiResponse
// 	}

// 	// #endregion Static Methods
// }

// // #endregion Service Class



// /////////////////////
// /// PACKAGE CLASS ///
// /////////////////////
// // #region Package Class

// class Package implements PackageType {

// 	//////////////////
// 	/// PROPERTIES ///
// 	//////////////////
// 	// #region Properties

// 	private _parent: Service
// 	private _id: string
// 	private _name: string
// 	private _description: string
// 	private _cost: number
// 	private _price: number
// 	private _duration: number

// 	constructor(parent: Service, data: Optional<PackageType, 'id'>) {
// 		this._parent = parent
// 		this._id = data.id || new mongoose.Types.ObjectId().toString()
// 		this._name = data.name
// 		this._description = data.description
// 		this._cost = data.cost
// 		this._price = data.price
// 		this._duration = data.duration
// 	}

// 	/** The parent Service instance that contains this Package. */
// 	get parent() { return this._parent }
// 	async setParent(serviceId: string, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
// 		const code = 'UPDATE_PACKAGE_PARENT'

// 		// Find the new parent service.
// 		const result = await Service.find({ id: serviceId }, true) as ApiResponse

// 		if (!result.passed || (result.data as Service[]).length === 0) {
// 			const errorMsg = `Service with id ${serviceId} not found.`
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(400, code, false, errorMsg, { package: this.toJSON(), newParentServiceId: serviceId }, 'package_update_parent')
// 		}

// 		const newParent = (result.data as Service[])[0]

// 		// If the new parent is the same as the current parent, no changes are needed.
// 		if (newParent.id === this._parent.id) {
// 			return !returnApiResponse ? this
// 				: apiResponse(201, code, true, 'Package parent is already the specified service.', this.toJSON(), 'package_update_parent')
// 		}

// 		// Remove this package from the current parent's packages array.
// 		const oldParent = this._parent
// 		const currentIndex = this.index

// 		if (currentIndex === -1) {
// 			const errorMsg = `Package id ${this._id} not found in current parent service id ${this._parent.id}.`
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(401, code, false, errorMsg, { package: this.toJSON(), currentParentService: this._parent.toJSON() }, 'package_update_parent')
// 		}

// 		this._parent.packages.splice(currentIndex, 1)

// 		// Add this package to the new parent's packages array.
// 		newParent.packages.push(this)

// 		// Update this package's parent reference.
// 		this._parent = newParent

// 		// Save both parent services.
// 		const oldParentSaveResult = await oldParent.save(true) as ApiResponse
// 		if (!oldParentSaveResult.passed) {
// 			const errorMsg = 'Failed to save old parent service after package parent update.'
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(402, code, false, errorMsg, { package: this.toJSON(), oldParentService: oldParent.toJSON() }, 'package_update_parent')
// 		}

// 		const newParentSaveResult = await newParent.save(true) as ApiResponse
// 		if (!newParentSaveResult.passed) {
// 			const errorMsg = 'Failed to save new parent service after package parent update.'
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(403, code, false, errorMsg, { package: this.toJSON(), newParentService: newParent.toJSON() }, 'package_update_parent')
// 		}

// 		// Return the result.
// 		return !returnApiResponse ? this
// 			: apiResponse(200, code, true, 'Package parent updated successfully.', this.toJSON(), 'package_update_parent')
// 	}

// 	/** The unique identifier of the Package. */
// 	get id() { return this._id }

// 	/** The name of the Package. */
// 	get name() { return this._name }
// 	set name(value: string) {
// 		const validationResult = Package.validateName(value, true) as ApiResponse
// 		if (!validationResult.passed) throw new Error(validationResult.message)
// 		this._name = (validationResult.data as { name: string }).name
// 	}

// 	/** A brief description of the Package. */
// 	get description() { return this._description }
// 	set description(value: string) {
// 		const validationResult = Package.validateDescription(value, true) as ApiResponse
// 		if (!validationResult.passed) throw new Error(validationResult.message)
// 		this._description = (validationResult.data as { description: string }).description
// 	}

// 	/** The approximate cost of the Package to the provider. */
// 	get cost() { return this._cost }
// 	set cost(value: number) {
// 		const validationResult = Package.validateCost(value, true) as ApiResponse
// 		if (!validationResult.passed) throw new Error(validationResult.message)
// 		this._cost = (validationResult.data as { cost: number }).cost
// 	}

// 	/** The price of the Package charged to the customer. */
// 	get price() { return this._price }
// 	set price(value: number) {
// 		const validationResult = Package.validatePrice(value, true) as ApiResponse
// 		if (!validationResult.passed) throw new Error(validationResult.message)
// 		this._price = (validationResult.data as { price: number }).price
// 	}

// 	/** The duration of the Package in minutes. */
// 	get duration() { return this._duration }
// 	set duration(value: number) {
// 		const validationResult = Package.validateDuration(value, true) as ApiResponse
// 		if (!validationResult.passed) throw new Error(validationResult.message)
// 		this._duration = (validationResult.data as { duration: number }).duration
// 	}

// 	/**
// 	 * Get the index of this Package within its parent Service's packages array.
// 	 *
// 	 * @returns The index of the Package instance within the parent Service's packages array.
// 	 * If not found, returns -1.
// 	 */
// 	get index(): number {
// 		const index = this._parent.packages.findIndex(pkg => pkg.id === this._id)
// 		return index
// 	}

// 	/**
// 	 * Move the Package instance to a new index within its parent Service's packages array.
// 	 *
// 	 * @param newIndex The new index to move the package to.
// 	 * @param returnApiResponse Whether to return an ApiResponse or the Package instance. (default: `false`)
// 	 * @returns The updated Package instance or an ApiResponse indicating the result of the operation.
// 	 */
// 	async setIndex(newIndex: number, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
// 		const code = 'MOVE_PACKAGE_INSTANCE'

// 		// Find the current index of this package in the parent's packages array.
// 		const currentIndex = this._parent.packages.findIndex(pkg => pkg.id === this._id)
// 		if (currentIndex === -1) {
// 			const errorMsg = `Package id ${this._id} not found in parent service id ${this._parent.id}.`
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(401, code, false, errorMsg, { package: this.toJSON(), parentService: this._parent.toJSON() }, 'package_move')
// 		}

// 		// Adjust newIndex to be within bounds.
// 		const adjustedIndex = newIndex < 0 ? 0
// 			: newIndex >= this._parent.packages.length ? this._parent.packages.length - 1
// 				: newIndex

// 		// If the new index is the same as the current index, no changes are needed.
// 		if (adjustedIndex === currentIndex) {
// 			return !returnApiResponse ? this
// 				: apiResponse(201, code, true, 'Package is already at the specified index.', this, 'package_move')
// 		}

// 		// Move the package within the parent's packages array.
// 		const packageToMove = this._parent.packages.splice(currentIndex, 1)[0]
// 		this._parent.packages.splice(adjustedIndex, 0, packageToMove)

// 		// Save the updated parent service.
// 		await this._parent.save()

// 		// Return the result.
// 		return !returnApiResponse ? this
// 			: apiResponse(200, code, true, 'Package moved successfully.', this, 'package_move')
// 	}

// 	/**
// 	 * Update the Package instance with new data.
// 	 *
// 	 * @param data The new data to update the Package with.
// 	 * - parentId: string - The id of the new parent Service.
// 	 * - index: number - The new index of the package within the parent's packages array.
// 	 * - name: string - Name of the package.
// 	 * - description: string - Description of the package.
// 	 * - cost: number - The approximate cost of the package to the provider.
// 	 * - price: number - The price charged to the customer for the package.
// 	 * - duration: number - Duration of the package in minutes.
// 	 * @param returnApiResponse Whether to return an ApiResponse or the Package instance. (default: `false`)
// 	 * @returns The updated Package instance or an ApiResponse indicating the result of the operation.
// 	 */
// 	async update(data: Partial<Omit<Package, 'id'>> & { parentId?: string, index?: number }, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
// 		const code = 'UPDATE_PACKAGE_INSTANCE'

// 		// Validate the provided data.
// 		const validationResult = Package.validate(data, true) as ApiResponse

// 		if (!validationResult.passed) {
// 			if (!returnApiResponse) throw new Error(validationResult.message)
// 			return validationResult
// 		}

// 		data = validationResult.data as Partial<Omit<Package, 'id'>>

// 		// If parent id is being updated, handle that first.
// 		if (data.parentId !== undefined) {
// 			const parentUpdateResult = await this.setParent(data.parentId, true) as ApiResponse

// 			if (!parentUpdateResult.passed) {
// 				if (!returnApiResponse) throw new Error(parentUpdateResult.message)
// 				return parentUpdateResult
// 			}
// 		}

// 		// If index is being updated, handle that next.
// 		if (data.index !== undefined) {
// 			const indexUpdateResult = await this.setIndex(data.index, true) as ApiResponse

// 			if (!indexUpdateResult.passed) {
// 				if (!returnApiResponse) throw new Error(indexUpdateResult.message)
// 				return indexUpdateResult
// 			}
// 		}

// 		// Update the package properties.

// 		if (data.name !== undefined) this._name = data.name
// 		if (data.description !== undefined) this._description = data.description
// 		if (data.cost !== undefined) this._cost = data.cost
// 		if (data.price !== undefined) this._price = data.price
// 		if (data.duration !== undefined) this._duration = data.duration

// 		this.save()

// 		return !returnApiResponse ? this
// 			: apiResponse(200, code, true, 'Package updated successfully.', this, 'package_update')
// 	}

// 	/**
// 	 * Save the current Package instance to the database.
// 	 *
// 	 * @param returnApiResponse Whether to return an ApiResponse or the Package instance. (default: `false`)
// 	 * @returns The saved Package instance or an ApiResponse indicating the result of the operation.
// 	 */
// 	async save(returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
// 		const code = 'SAVE_PACKAGE_INSTANCE'

// 		// Find the index of this package in the parent's packages array.
// 		const index = this.index

// 		if (index === -1) {
// 			const errorMsg = `Package id ${this._id} not found in parent service id ${this._parent.id}.`
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(400, code, false, errorMsg, { package: this.toJSON(), parentService: this._parent.toJSON() }, 'package_save')
// 		}

// 		// Update the package in the parent's packages array.
// 		this._parent.packages[index] = this

// 		// Save the updated parent service to the database.
// 		const parentSaveResult = await this._parent.save(true) as ApiResponse

// 		if (!parentSaveResult.passed) {
// 			const errorMsg = `Failed to save parent service (${this._parent.id}) while saving package (${this._id}).`
// 			if (!returnApiResponse) throw new Error(errorMsg)
// 			return apiResponse(401, code, false, errorMsg, { package: this.toJSON(), parentService: this._parent.toJSON() }, 'package_save')
// 		}

// 		// Return the result.
// 		return this
// 	}

// 	/** Convert the Package instance to a plain object. */
// 	toJSON(): PackageType {
// 		return {
// 			id: this._id,
// 			name: this._name,
// 			description: this._description,
// 			cost: this._cost,
// 			price: this._price,
// 			duration: this._duration
// 		}
// 	}

// 	/** Get a string representation of the Package instance. */
// 	toString(): string {
// 		return `Service Package: ${this._name} (${this._id})`
// 	}

// 	/** Get a detailed string representation of the Package instance. */
// 	toRepr(): string {
// 		return `Service.Package (id=${this._id}, name=${this._name}, description=${this._description}, cost=${this._cost}, price=${this._price}, duration=${this._duration})`
// 	}

// 	// #endregion Properties



// 	///////////////////////////////
// 	/// DATA VALIDATION METHODS ///
// 	///////////////////////////////
// 	// #region Data Validation

// 	static validate(values: Record<string, any>, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE'

// 		const validValues: Record<string, any> = {}
// 		const options = {
// 			id: Package.validateId,
// 			name: Package.validateName,
// 			description: Package.validateDescription,
// 			cost: Package.validateCost,
// 			price: Package.validatePrice,
// 			duration: Package.validateDuration,
// 		} as Record<string, (value: any, returnApiResponse: boolean) => any>

// 		// Validate each provided value using the corresponding validation function.
// 		for (const [oKey, oValue] of Object.entries(values)) {
// 			const validateFn = options[oKey]
// 			if (!validateFn)
// 				return !returnApiResponse ? false
// 					: apiResponse(400, code, false, `Validation function for ${oKey} not found.`, { [oKey]: oValue }, 'package')

// 			const key = oKey as keyof Record<string, any>

// 			const result = validateFn(oValue, returnApiResponse)
// 			if (!result.passed) return result

// 			validValues[key] = result.data[key]
// 		}

// 		// All values are valid.
// 		return !returnApiResponse ? true
// 			: apiResponse(200, code, true, 'Package data is valid.', validValues as Partial<Package>, 'package')
// 	}

// 	static validateId(value: any, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE_ID'

// 		// Check that the value is a string.
// 		if (typeof value !== 'string')
// 			return !returnApiResponse ? false
// 				: apiResponse(400, code, false, 'Package id must be a string.', { id: value }, 'package_id')

// 		// Trim the value and set to id.
// 		const id = value.trim() as string

// 		// Check that id a valid MongoDB ObjectId.
// 		const objectIdRegex = /^[0-9a-fA-F]{24}$/
// 		if (!objectIdRegex.test(id))
// 			return !returnApiResponse ? false
// 				: apiResponse(401, code, false, 'Package id must be a valid MongoDB ObjectId.', { id }, 'package_id')

// 		// Id is valid.
// 		return !returnApiResponse ? true
// 			: apiResponse(200, code, true, 'Package id is valid.', { id }, 'package_id')
// 	}

// 	static validateName(value: any, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE_NAME'

// 		// Check that the value is a string.
// 		if (typeof value !== 'string')
// 			return !returnApiResponse ? false
// 				: apiResponse(400, code, false, 'Package name must be a string.', { name: value }, 'package_name')

// 		// Trim the value and set to name.
// 		const name = value.trim() as string

// 		// Validate name length.
// 		if (name.length === 0)
// 			return !returnApiResponse ? false
// 				: apiResponse(401, code, false, 'Package name cannot be empty.', { name }, 'package_name')

// 		const minLength = 3
// 		if (name.length < minLength)
// 			return !returnApiResponse ? false
// 				: apiResponse(402, code, false, `Package name must be at least ${minLength} characters long.`, { name }, 'package_name')

// 		const maxLength = 100
// 		if (name.length > maxLength)
// 			return !returnApiResponse ? false
// 				: apiResponse(403, code, false, `Package name must be no more than ${maxLength} characters long.`, { name }, 'package_name')

// 		// Name is valid.
// 		return !returnApiResponse ? true
// 			: apiResponse(200, code, true, 'Package name is valid.', { name }, 'package_name')
// 	}

// 	static validateDescription(value: any, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE_DESCRIPTION'

// 		// Check that the value is a string.
// 		if (typeof value !== 'string')
// 			return !returnApiResponse ? false
// 				: apiResponse(400, code, false, 'Package description must be a string.', { description: value }, 'package_description')

// 		// Trim the value and set to description.
// 		const description = value.trim() as string

// 		// Validate description length.
// 		if (description.length === 0)
// 			return !returnApiResponse ? false
// 				: apiResponse(401, code, false, 'Package description cannot be empty.', { description }, 'package_description')

// 		const minLength = 10
// 		if (description.length < minLength)
// 			return !returnApiResponse ? false
// 				: apiResponse(402, code, false, `Package description must be at least ${minLength} characters long.`, { description }, 'package_description')

// 		const maxLength = 500
// 		if (description.length > maxLength)
// 			return !returnApiResponse ? false
// 				: apiResponse(403, code, false, `Package description must be no more than ${maxLength} characters long.`, { description }, 'package_description')

// 		// Description is valid.
// 		return !returnApiResponse ? true
// 			: apiResponse(200, code, true, 'Package description is valid.', { description }, 'package_description')
// 	}

// 	static validateCost(value: any, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE_COST'

// 		// Attempt to parse it as a float.
// 		const cost = typeof value === 'string' ? parseFloat(value) : value

// 		// Check that cost is a non-negative number.
// 		if (typeof cost !== 'number' || isNaN(cost))
// 			return !returnApiResponse ? false
// 				: apiResponse(400, code, false, 'Package cost must be a non-negative number.', { cost: value }, 'package_cost')

// 		// Check that cost is non-negative.
// 		if (cost < 0)
// 			return !returnApiResponse ? false
// 				: apiResponse(401, code, false, 'Package cost cannot be negative.', { cost }, 'package_cost')

// 		// Cost is valid.
// 		return !returnApiResponse ? true
// 			: apiResponse(200, code, true, 'Package cost is valid.', { cost }, 'package_cost')
// 	}

// 	static validatePrice(value: any, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE_PRICE'

// 		// Attempt to parse it as a float.
// 		const price = typeof value === 'string' ? parseFloat(value) : value

// 		// Check that price is a non-negative number.
// 		if (typeof price !== 'number' || isNaN(price))
// 			return !returnApiResponse ? false
// 				: apiResponse(400, code, false, 'Package price must be a non-negative number.', { price: value }, 'package_price')

// 		// Check that price is non-negative.
// 		if (price < 0)
// 			return !returnApiResponse ? false
// 				: apiResponse(401, code, false, 'Package price cannot be negative.', { price }, 'package_price')

// 		// Price is valid.
// 		return !returnApiResponse ? true
// 			: apiResponse(200, code, true, 'Package price is valid.', { price }, 'package_price')
// 	}

// 	static validateDuration(value: any, returnApiResponse: boolean = true) {
// 		const code = 'VALIDATE_PACKAGE_DURATION'

// 		// Attempt to parse it as an integer.
// 		const duration = typeof value === 'string' ? parseInt(value) : value

// 		// Check that duration is a number.
// 		if (typeof duration !== 'number' || isNaN(duration))
// 			return !returnApiResponse ? false
// 				: apiResponse(400, code, false, 'Package duration must be a number.', { duration: value }, 'package_duration')

// 		// Check that duration is an integer.
// 		if (!Number.isInteger(duration))
// 			return !returnApiResponse ? false
// 				: apiResponse(401, code, false, 'Package duration must be an integer.', { duration }, 'package_duration')

// 		// Check that duration is non-negative.
// 		if (duration < 0)
// 			return !returnApiResponse ? false
// 				: apiResponse(402, code, false, 'Package duration cannot be negative.', { duration }, 'package_duration')

// 		// Duration is valid.
// 		return apiResponse(200, code, true, 'Package duration is valid.', { duration }, 'package_duration')
// 	}

// 	// #endregion Data Validation
// }

// // #endregion Package Class



// //////////////////////
// /// PACKAGES CLASS ///
// //////////////////////
// // #region Packages Class

// class Packages {
// 	private _parent: Service
// 	private _items: Package[]

// 	constructor(parent: Service, items: PackageType[]) {
// 		this._parent = parent
// 		this._items = items.map(item => new Package(parent, item))
// 	}

// 	get items(): PackageType[] {
// 		return [...this._items]
// 	}

// 	get(idOrindex: string | number): Package | null {
// 		const index = typeof idOrindex === 'number' ? idOrindex
// 			: this._items.findIndex(pkg => pkg.id === idOrindex)

// 		if (index < 0 || index >= this._items.length) return null

// 		return this._items[index]
// 	}

// 	async find(data: Partial<Ranged<Queryable<PackageType, 'id'>, 'cost' | 'price' | 'duration'>>, returnApiResponse: boolean = true): Promise<Package[] | ApiResponse> {
// 		const response = await api.get('service/package', {
// 			serviceId: this._parent.id,
// 			packageData: data,
// 			returnApiResponse
// 		}) as ApiResponse

// 		if (!response.passed) {
// 			if (!returnApiResponse) throw new Error(response.message)
// 			return response
// 		}

// 		const found = (response.data as PackageType[]).map(pkgData => new Package(this._parent, pkgData))

// 		if (!returnApiResponse) return found
// 		response.data = found
// 		return response
// 	}

// 	async add(data: Optional<PackageType, 'id'>, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
// 		const code = 'ADD_PACKAGE'

// 		// Validate the package data.
// 		const validationResult = Package.validate(data, true) as ApiResponse
// 		if (!validationResult.passed) {
// 			if (!returnApiResponse) throw new Error(validationResult.message)
// 			return validationResult
// 		}

// 		data = validationResult.data as Optional<PackageType, 'id'>

// 		// Create the new package and add it to the service.
// 		const newPackage = new Package(this._parent, data)
// 		this._items.push(newPackage)

// 		// Save the updated service.
// 		const updatedServiceResponse = await this._parent.save(true) as ApiResponse

// 		if (!updatedServiceResponse.passed) {
// 			if (!returnApiResponse) throw new Error(updatedServiceResponse.message)
// 			return updatedServiceResponse
// 		}

// 		// Return the result.
// 		return !returnApiResponse ? newPackage
// 			: apiResponse(200, code, true, 'Package added to service successfully.', newPackage, 'service_add_package')
// 	}

// 	// async update(idOrIndex: string | number, packageData: Partial<Omit<PackageType, 'id'>>, returnApiResponse: boolean = true): Promise<Package | ApiResponse> {
// 	// 	const code = 'UPDATE_PACKAGE'

// 	// 	// Find the package to update.
// 	// 	if (typeof idOrIndex === 'string') {
// 	// 		idOrIndex = this._items.findIndex(pkg => pkg.id === idOrIndex)

// 	// 		if (idOrIndex === -1) {
// 	// 			const errorMsg = 'Package with specified id not found.'
// 	// 			if (!returnApiResponse) throw new Error(errorMsg)
// 	// 			return apiResponse(400, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_update_package')
// 	// 		}
// 	// 	}

// 	// 	const packageIndex = idOrIndex as number

// 	// 	if (packageIndex < 0 || packageIndex >= this._items.length) {
// 	// 		const errorMsg = 'Package index out of bounds.'
// 	// 		if (!returnApiResponse) throw new Error(errorMsg)
// 	// 		return apiResponse(401, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_update_package')
// 	// 	}

// 	// 	const currentPackage = this._items[packageIndex]

// 	// 	// Update the package in the current instance.
// 	// 	const updateResult = await currentPackage.update(packageData, true) as ApiResponse

// 	// 	if (!updateResult.passed) {
// 	// 		if (!returnApiResponse) throw new Error(updateResult.message)
// 	// 		return updateResult
// 	// 	}

// 	// 	// Return the result.
// 	// 	return !returnApiResponse ? currentPackage : updateResult
// 	// }

// 	// async remove(idOrIndex: string | number, returnApiResponse: boolean = true): Promise<boolean | ApiResponse> {
// 	// 	const code = 'REMOVE_PACKAGE'

// 	// 	// Find the package to remove.
// 	// 	if (typeof idOrIndex === 'string') {
// 	// 		idOrIndex = this._items.findIndex(pkg => pkg.id === idOrIndex)

// 	// 		if (idOrIndex === -1) {
// 	// 			const errorMsg = 'Package with specified id not found.'
// 	// 			if (!returnApiResponse) throw new Error(errorMsg)
// 	// 			return apiResponse(400, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_remove_package')
// 	// 		}
// 	// 	}

// 	// 	const packageIndex = idOrIndex as number

// 	// 	if (packageIndex < 0 || packageIndex >= this._items.length) {
// 	// 		const errorMsg = 'Package index out of bounds.'
// 	// 		if (!returnApiResponse) throw new Error(errorMsg)
// 	// 		return apiResponse(401, code, false, errorMsg, { id: this._parent.id, packageIdOrIndex: idOrIndex }, 'service_remove_package')
// 	// 	}

// 	// 	this._items.splice(packageIndex, 1)

// 	// 	// Save the updated service.
// 	// 	const updatedServiceResponse = await this._parent.save(true) as ApiResponse

// 	// 	if (!updatedServiceResponse.passed) {
// 	// 		if (!returnApiResponse) throw new Error(updatedServiceResponse.message)
// 	// 		return updatedServiceResponse
// 	// 	}

// 	// 	// Return the result.
// 	// 	return !returnApiResponse ? true
// 	// 		: apiResponse(200, code, true, 'Package removed from service successfully.', { id: this._parent.id, packageIndex }, 'service_remove_package')
// 	// }

// 	toJSON(): PackageType[] {
// 		return this._items.map(pkg => pkg.toJSON())
// 	}

// 	toString(): string {
// 		return `Service Packages: ${this._parent.name} | ${this._items.length} items`
// 	}

// 	toRepr(): string {
// 		return `Service.Packages (serviceId=${this._parent.id}, items=[${this._items.map(pkg => pkg.toJSON()).join(', ')}])`
// 	}
// }

// // #endregion Packages Class

// export default Service