import { ApiResponse, apiResponse } from "../lib/apiResponse"
import { Main, Model, ModelError, generateId, UUID, validateId } from "./index.model"



/////////////////
/// CONSTANTS ///
/////////////////
// #region Constants

const MIN_DESCRIPTION_LENGTH = 10 as const
const MAX_DESCRIPTION_LENGTH = 500 as const
const DEFAULT_HERO_IMAGE_URL = '/images/services/{key}/hero.png' as const

const MIN_DETAIL_CONTENT_LENGTH = 500 as const
const MAX_DETAIL_CONTENT_LENGTH = 5000 as const
const DEFAULT_DETAIL_IMAGE_URL = '/images/services/{key}/detail/{label}.png' as const

// #endregion Constants



// #region -



/////////////////////
/// SERVICE MODEL ///
/////////////////////
// #region Service Model 



//////////////////
/// INTERFACES ///
//////////////////
// #region Interfaces

export interface ServiceInfo {
	/** The unique identifier of the service. */
	id: UUID

	/** The unique key of the service. */
	key: string

	/** The name of the service. */
	name: string

	/** A brief description of the service. */
	description: string

	/** The URL of the image representing the service. */
	imageUrl: string

	/** Whether to feature this service on the home page. */
	topService: boolean

	/** The detailed sections for the service page. */
	details: (ServiceDetail | ServiceDetailInfo)[]
}

export interface ServiceInit {
	/** The unique identifier of the service. */
	id?: UUID | string

	/** The name of the service. */
	name: string

	/** A brief description of the service. */
	description: string

	/** The URL of the image representing the service. */
	imageUrl?: string

	/** Whether to feature this service on the home page. */
	topService?: boolean

	/** The detailed sections for the service page. */
	details: (ServiceDetailInit | ServiceDetail | string)[]
}

export interface ServiceUpdate {
	/** The unique key of the service. */
	key?: UUID | string

	/** The name of the service. */
	name?: string

	/** A brief description of the service. */
	description?: string

	/** The URL of the image representing the service. */
	imageUrl?: string

	/** Whether to feature this service on the home page. */
	topService?: boolean
}

export interface ServiceFilter {
	/** Filter by unique service identifier(s). */
	id?: UUID | UUID[] | string | string[]

	/** Filter by unique service key(s). */
	key?: string | string[]

	/** Filter by name (partial match, case-insensitive). */
	name?: string

	/** Filter by description (partial match, case-insensitive). */
	description?: string

	/** Filter by whether the service is a top service. */
	topService?: boolean

	/** Filter by detail label (case-insensitive). */
	detail_label?: string

	/** Filter by detail title (case-insensitive). */
	detail_title?: string

	/** Filter by detail content (partial match, case-insensitive). */
	detail_content?: string
}

// #endregion Interfaces



/////////////////////
/// SERVICE CLASS ///
/////////////////////
// #region Service Class

class Service<T extends ServiceInfo = ServiceInfo> extends Model<T, ServiceInit, ServiceUpdate> implements ServiceInfo {
	private _id = null as unknown as ServiceInfo['id']
	private _name = null as unknown as ServiceInfo['name']
	private _description = null as unknown as ServiceInfo['description']
	private _imageUrl = null as unknown as ServiceInfo['imageUrl']
	private _topService = null as unknown as ServiceInfo['topService']
	private _details = null as unknown as ServiceDetail[]

	/** Creates a new Service instance.
	 * 
	 * @param params - The initialization data for the Service.
	 * @param params.id - The unique identifier of the service. If not provided, a new one will be generated.
	 * @param params.key - The unique key of the service. If not provided, it will be generated from the name.
	 * @param params.name - The name of the service.
	 * @param params.description - A brief description of the service.
	 * @param params.imageUrl - The URL of the image representing the service. If not provided, a default URL will be used.
	 * @param params.topService - Whether to feature this service on the home page. Defaults to `false` if not provided.
	 * @param params.details - The detailed sections for the service page.
	 * 
	 * @throws `ModelError` If any of the provided data is invalid.
	 */
	constructor(params: ServiceInit) { super(params) }

	///////////////////////////
	/// GETTERS AND SETTERS ///
	///////////////////////////
	// #region Getters and Setters

	/// ID ///

	/** The unique identifier of the service. */
	get id(): ServiceInfo['id'] { return this._id }

	/** Sets the unique identifier of the service.
	 * 
	 * @param value - The unique identifier to set.
	 * 
	 * If no id is provided, a new one will be generated.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Service.validateId}
	 */
	protected set id(value: any) {
		const sender = 'Service - set id' as const

		Service.validateId(value).then(response => {
			if (response.passed)
				this._id = response.data!.valid
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a service id.
	 * 
	 * This static method checks if the provided value is a valid id. If no value is provided, it generates 
	 * a new id and returns it as valid.
	 * 
	 * @param value - The value to validate as a service id.
	 * 
	 * @returns An API response indicating the validation result.
	 */
	static async validateId(value: any): Promise<ApiResponse> {
		const sender = 'Service - validate id' as const

		if (value === undefined) {
			const id = generateId()
			return apiResponse(true, sender, 201, 'Service id is valid.', { value, valid: id })
		}

		return validateId(value)
			? apiResponse(true, sender, 200, 'Service id is valid.', { value, valid: value })
			: apiResponse(false, sender, 400, 'Service id is not valid.', { value })
	}

	/// KEY ///

	/** The unique key of the service.
	 * 
	 * If no key is set, it will be generated from the name.
	 */
	get key(): ServiceInfo['key'] { return this._name.trim().toLowerCase().replace(/\s+/g, '-') }

	/// NAME ///

	/** The name of the service. */
	get name(): ServiceInfo['name'] { return this._name }

	/** Sets the name of the service.
	 * 
	 * @param value - The name to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Service.validateName}
	 */
	set name(value: any) {
		const sender = 'Service - set name' as const

		Service.validateName(value, this._id).then(response => {
			if (response.passed)
				this._name = response.data!.valid
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the uniqueness and format of a service name.
	 *
	 * This static method checks if the provided value is a string, trims it, and ensures it is not empty.
	 * It then queries for existing services with the same name. If no such service exists, or if the only
	 * existing service matches the provided `ignoreId`, the name is considered valid and unique.
	 * Otherwise, it fails the validation.
	 *
	 * @param value - The value to validate as a service name.
	 * @param ignoreId - (Optional) An ID to ignore during uniqueness check, useful for updates.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateName(value: any, ignoreId?: UUID | string): Promise<ApiResponse> {
		const sender = 'Service - validate name' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Service name must be a string.', { value })

		const name = value.trim()

		if (name.length === 0)
			return apiResponse(false, sender, 401, 'Service name cannot be empty.', { value })

		const services = await this.find({ name })

		if (services.length === 0)
			return apiResponse(true, sender, 200, 'Service name is valid and unique.', { valid: name })

		if (services.length === 1 && ignoreId && services[0].id === ignoreId)
			return apiResponse(true, sender, 201, 'Service name is valid and unique.', { valid: name })

		return apiResponse(false, sender, 402, 'Service name must be unique.', { value })
	}

	/// DESCRIPTION ///

	/** The brief description of the service. */
	get description(): ServiceInfo['description'] { return this._description }

	/** Sets the brief description of the service.
	 * 
	 * @param value - The description to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Service.validateDescription}
	 */
	set description(value: any) {
		const sender = 'Service - set description' as const

		Service.validateDescription(value).then(response => {
			if (response.passed)
				this._description = response.data!.valid
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format and length of a service description.
	 *
	 * This static method checks if the provided value is a string, trims it, and ensures it meets
	 * the minimum and maximum length requirements defined by {@link MIN_DESCRIPTION_LENGTH} and 
	 * {@link MAX_DESCRIPTION_LENGTH}.
	 * 
	 * @param value - The value to validate as a service description.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateDescription(value: any): Promise<ApiResponse> {
		const sender = 'Service - validate description' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Service description must be a string.', { value })

		const description = value.trim()

		if (description.length === 0)
			return apiResponse(false, sender, 401, 'Service description cannot be empty.', { value })

		if (description.length < MIN_DESCRIPTION_LENGTH)
			return apiResponse(false, sender, 402, `Service description must be at least ${MIN_DESCRIPTION_LENGTH} characters long.`, { value })

		if (description.length > MAX_DESCRIPTION_LENGTH)
			return apiResponse(false, sender, 403, `Service description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`, { value })

		return apiResponse(true, sender, 200, 'Service description is valid.', { value, valid: description })
	}

	/// IMAGE URL ///

	/** The URL of the image representing the service. */
	get imageUrl(): ServiceInfo['imageUrl'] { return this._imageUrl }

	/** Sets the URL of the image representing the service.
	 * 
	 * @param value - The image URL to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Service.validateImageUrl}
	 */
	set imageUrl(value: any) {
		const sender = 'Service - set imageUrl' as const

		Service.validateImageUrl(value).then(response => {
			if (response.passed)
				this._imageUrl = response.data!.valid
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a service image URL.
	 *
	 * This static method checks if the provided value is a string, trims it, and ensures it is not empty.
	 * If the value is `undefined`, it returns a default image URL based on the service key as defined by
	 * {@link DEFAULT_HERO_IMAGE_URL}.
	 * 
	 * @param value - The value to validate as a service image URL.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateImageUrl(value: any): Promise<ApiResponse> {
		const sender = 'Service - validate imageUrl' as const

		if (value === undefined) {
			const url = DEFAULT_HERO_IMAGE_URL.replace('{key}', '')
			return apiResponse(true, sender, 200, 'Service imageUrl is valid.', { value, valid: url })
		}

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Service imageUrl must be a string.', { value })

		const url = value.trim()

		if (url.length === 0)
			return apiResponse(false, sender, 401, 'Service imageUrl cannot be an empty string.', { value })

		return apiResponse(true, sender, 200, 'Service imageUrl is valid.', { value, valid: url })
	}

	/// TOP SERVICE ///

	/** Whether to feature this service on the home page. */
	get topService(): ServiceInfo['topService'] { return this._topService }

	/** Sets whether to feature this service on the home page.
	 * 
	 * @param value - Whether to feature this service on the home page.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Service.validateTopService}
	 */
	set topService(value: ServiceInit['topService']) {
		const sender = 'Service - set topService' as const

		Service.validateTopService(value).then(response => {
			if (response.passed)
				this._topService = response.data!.valid
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates whether to feature this service on the home page.
	 *
	 * This static method converts the provided value to a boolean and returns it.
	 * It does not perform any additional validation and always passes.
	 * 
	 * @param value - The value to validate as a service topService.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateTopService(value: any): Promise<ApiResponse> {
		const sender = 'Service - validate topService' as const

		const topService = Boolean(value)

		return apiResponse(true, sender, 200, 'Service topService is valid.', { value, valid: topService })
	}

	/// DETAILS ///

	/** The detailed sections for the service page. */
	get details(): ServiceDetail[] { return [...this._details] }

	/** Sets the detailed sections for the service page.
	 * 
	 * @param value - The detailed sections to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Service.validateDetails}
	 */
	protected set details(value: ServiceInit['details']) {
		const sender = 'Service - set details' as const

		Service.validateDetails(value).then(response => {
			if (response.passed)
				this._details = (response.data!.valid as ServiceDetailInit[]).map(detail => new ServiceDetail(detail))
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	static async validateDetails(value: any): Promise<ApiResponse> {
		const sender = 'Service - validate details' as const

		let obj = value
		let passed = true
		const valid = [] as ServiceDetailInit[]
		const responses = [] as ApiResponse[]

		if (typeof obj === 'string' && obj.startsWith('[') && obj.endsWith(']')) {
			obj = JSON.parse(obj)

			if (!Array.isArray(obj))
				return apiResponse(false, sender, 401, 'Unable to parse service details from string.', { value })
		}

		if (!Array.isArray(obj)) obj = [obj]

		for (const o of obj) {
			const response = await ServiceDetail.validate(o)

			valid.push(response.data!.valid)

			if (!response.passed) passed = false
		}

		return passed
			? apiResponse(true, sender, 200, 'Service details are valid.', { value, valid, responses })
			: apiResponse(false, sender, 400, 'One or more service details are invalid.', { value, valid, responses })
	}

	/** Adds a detailed section to the service page.
	 * 
	 * @param value - The detail to add.
	 * @param index - The index to insert the detail at. 
	 * If not provided, the detail will be added to the end.
	 * Use negative indices to count from the end (-1 is the last position).
	 * 
	 * @returns The added detail.
	 * 
	 * @throws `ModelError` If the detail is invalid or the index is out of bounds.
	 */
	addDetail(value: ServiceDetail | ServiceDetailInit | string, index?: number) {
		const sender = 'Service - addDetail' as const

		const detail = value instanceof ServiceDetail ? value
			: typeof value === 'string' ? ServiceDetail.parse(value)
				: typeof value === 'object' ? new ServiceDetail(value)
					: null

		if (!detail)
			ModelError.throw(sender, 400, 'Invalid service detail provided to addDetail.', { detail: value })

		if (index !== undefined) this._details.splice(index, 0, detail)
		else this._details.push(detail)

		return detail
	}

	/** Removes a detailed section from the service page.
	 * 
	 * @param identifier - The detail to remove, specified by instance, label/title, or index.
	 * 
	 * @returns The removed detail.
	 * 
	 * @throws `ModelError` If the detail is not found.
	 */
	removeDetail(identifier: ServiceDetail | ServiceDetailInfo | string | number) {
		const sender = 'Service - removeDetail' as const

		const index = this.getDetailIndex(identifier)

		if (index === -1)
			ModelError.throw(sender, 400, 'Service detail to remove not found.', { identifier })

		return this._details.splice(index, 1)
	}

	/** Edits a detailed section of the service page.
	 * 
	 * @param identifier - The detail to edit, specified by instance, label/title, or index.
	 * @param params - The parameters to update.
	 * 
	 * @returns The edited detail.
	 * 
	 * @throws `ModelError` If the detail is not found or the update is invalid.
	 */
	editDetail(identifier: ServiceDetail | ServiceDetailInfo | string | number, params: ServiceDetailUpdate) {
		const sender = 'Service - editDetail' as const

		const index = this.getDetailIndex(identifier)

		if (index === -1)
			ModelError.throw(sender, 400, 'Service detail to edit not found.', { identifier })

		return this._details[index].set(params)
	}

	/** Moves a detailed section to a new index in the service page.
	 * 
	 * @param identifier - The detail to move, specified by instance, label/title, or index.
	 * @param newIndex - The new index to move the detail to.
	 * 
	 * @throws `ModelError` If the detail is not found or the new index is out of bounds.
	 */
	moveDetail(identifier: ServiceDetail | ServiceDetailInfo | string | number, newIndex: number) {
		const sender = 'Service - moveDetail' as const

		const currentIndex = this.getDetailIndex(identifier)

		if (currentIndex === -1)
			ModelError.throw(sender, 400, 'Service detail to move not found.', { identifier })

		this._details.splice(newIndex, 0, this._details.splice(currentIndex, 1)[0])
	}

	/** Gets the index of a detailed section in the service page.
	 * 
	 * @param identifier - The detail to find, specified by instance, label/title, or index.
	 * 
	 * @return The index of the detail, or `-1` if not found.
	 */
	getDetailIndex(identifier: ServiceDetail | ServiceDetailInfo | string | number): number {
		const sender = 'Service - getDetailIndex' as const

		if (typeof identifier === 'number') {
			if (identifier < 0 || identifier >= this._details.length) return -1

			return identifier
		}

		if (typeof identifier === 'string') {
			const label = identifier.trim().toLowerCase()

			const index = this._details.findIndex(detail => detail.label.toLowerCase() === label || detail.title.toLowerCase() === label)

			if (index === -1) return -1

			return index
		}

		if ('label' in identifier) {
			const label = identifier.label.trim().toLowerCase()

			const index = this._details.findIndex(detail => detail.label.toLowerCase() === label)

			if (index === -1) return -1

			return index
		}

		return -1
	}

	// #endregion Getters and Setters



	////////////////////////
	/// INSTANCE METHODS ///
	////////////////////////
	// #region Instance Methods

	display(): string { return `${this._name} Service (${this._id})` }

	async delete(): Promise<this> { ModelError.throw('Service - delete', 400, 'Method not implemented.') }

	async save(): Promise<this> { ModelError.throw('Service - save', 400, 'Method not implemented.') }

	// #endregion Instance Methods


	//////////////////////
	/// STATIC METHODS ///
	//////////////////////
	// #region Static Methods

	static parse(string: string): Service { return super.parse(string) }

	static async find(filters: ServiceFilter): Promise<Service[]> { return await super.find(filters) }

	static async insert(init: ServiceInit): Promise<Service> { return await super.insert(init) }

	static async update(filters: ServiceFilter, params: ServiceUpdate): Promise<Service[]> { return await super.update(filters, params) }

	static async delete(filters: ServiceFilter): Promise<Service[]> { return await super.delete(filters) }

	static async validate(values: any): Promise<ApiResponse> {
		return super.validate(values, {
			'id': { func: this.validateId },
			'name': { func: this.validateName, args: [values.id] },
			'description': { func: this.validateDescription },
			'imageUrl': { func: this.validateImageUrl },
			'topService': { func: this.validateTopService }
		})
	}

	// #endregion Static Methods
}

export default Service

// #endregion Service Class

// #endregion Service Model

// #region -



////////////////////////////
/// SERVICE DETAIL MODEL ///
////////////////////////////
// #region Service Detail Model



//////////////////
/// INTERFACES ///
//////////////////
// #region Interfaces

export interface ServiceDetailInfo {
	/** This will be displayed above the title in smaller text to let the user know what the section is about. */
	label: string

	/** This will be the main heading of the section displayed prominently. */
	title: string

	/** These will be displayed as paragraphs within the section. */
	content: string

	/** This image will be shown to the side of the text content. */
	imageUrl: string[]
}

export interface ServiceDetailInit {
	/** This will be displayed above the title in smaller text to let the user know what the section is about. */
	label: string

	/** This will be the main heading of the section displayed prominently. */
	title: string

	/** These will be displayed as paragraphs within the section. */
	content: string

	/** This image will be shown to the side of the text content. */
	imageUrl?: string | string[] | null
}

export interface ServiceDetailUpdate {
	/** This will be displayed above the title in smaller text to let the user know what the section is about. */
	label?: string

	/** This will be the main heading of the section displayed prominently. */
	title?: string

	/** These will be displayed as paragraphs within the section. */
	content?: string

	/** This image will be shown to the side of the text content. */
	imageUrl?: string | string[] | null
}

// #endregion Interfaces



////////////////////////////
/// SERVICE DETAIL CLASS ///
////////////////////////////
// #region Service Detail Class

class ServiceDetail extends Main<ServiceDetailInfo, ServiceDetailInit, ServiceDetailUpdate> implements ServiceDetailInfo {
	private _label = null as unknown as ServiceDetailInfo['label']
	private _title = null as unknown as ServiceDetailInfo['title']
	private _content = null as unknown as ServiceDetailInfo['content']
	private _imageUrl = null as unknown as ServiceDetailInfo['imageUrl']

	/** Creates a new ServiceDetail instance.
	 * 
	 * @param params - The initialization data for the ServiceDetail.
	 * @param params.label - This will be displayed above the title in smaller text to let the user know what the section is about.
	 * @param params.title - This will be the main heading of the section displayed prominently.
	 * @param params.content - These will be displayed as paragraphs within the section.
	 * @param params.imageUrl - This image will be shown to the side of the text content. If not provided, a default image URL will be used.
	 * 
	 * @throws `ModelError` If any of the provided data is invalid.
	 */
	constructor(params: ServiceDetailInit) { super(params) }

	///////////////////////////
	/// GETTERS AND SETTERS ///
	///////////////////////////
	// #region Getters and Setters

	/// LABEL ///

	/** This will be displayed above the title in smaller text to let the user know what the section is about. */
	get label(): ServiceDetailInfo['label'] { return this._label }

	/** Sets the label of the service detail.
	 * 
	 * @param value - The label to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link ServiceDetail.validateLabel}
	 */
	set label(value: any) {
		const sender = 'ServiceDetail - set label' as const

		ServiceDetail.validateLabel(value).then(response => {
			if (response.passed)
				this._label = response.data!.label
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a service detail label.
	 * 
	 * This static method checks if the provided value is a string and trims it. It ensures the label is not empty.
	 * 
	 * @param value - The value to validate as a service detail label.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateLabel(value: any): Promise<ApiResponse> {
		const sender = 'ServiceDetail - validate label' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'ServiceDetail label must be a string.', { label: value })

		const label = value.trim()

		if (label.length === 0)
			return apiResponse(false, sender, 401, 'ServiceDetail label cannot be empty.', { label })

		return apiResponse(true, sender, 200, 'ServiceDetail label is valid.', { label })
	}

	/// TITLE ///

	/** This will be the main heading of the section displayed prominently. */
	get title(): ServiceDetailInfo['title'] { return this._title }

	/** Sets the title of the service detail.
	 * 
	 * @param value - The title to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link ServiceDetail.validateTitle}
	 */
	set title(value: any) {
		const sender = 'ServiceDetail - set title' as const

		ServiceDetail.validateTitle(value).then(response => {
			if (response.passed)
				this._title = response.data!.title
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a service detail title.
	 * 
	 * This static method checks if the provided value is a string and trims it. It ensures the title is not empty.
	 * 
	 * @param value - The value to validate as a service detail title.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateTitle(value: any): Promise<ApiResponse> {
		const sender = 'ServiceDetail - validate title' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'ServiceDetail title must be a string.', { title: value })

		const title = value.trim()

		if (title.length === 0)
			return apiResponse(false, sender, 401, 'ServiceDetail title cannot be empty.', { title })

		return apiResponse(true, sender, 200, 'ServiceDetail title is valid.', { title })
	}

	/// CONTENT ///

	/** These will be displayed as paragraphs within the section. */
	get content(): ServiceDetailInfo['content'] { return this._content }

	/** Sets the content of the service detail.
	 * 
	 * @param value - The content to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link ServiceDetail.validateContent}
	 */
	set content(value: any) {
		const sender = 'ServiceDetail - set content' as const

		ServiceDetail.validateContent(value).then(response => {
			if (response.passed)
				this._content = response.data!.content
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format and length of a service detail content.
	 * 
	 * This static method checks if the provided value is a string, trims it, and ensures it meets
	 * the minimum and maximum length requirements defined by {@link MIN_DETAIL_CONTENT_LENGTH} and
	 * {@link MAX_DETAIL_CONTENT_LENGTH}.
	 * 
	 * @param value - The value to validate as a service detail content.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateContent(value: any): Promise<ApiResponse> {
		const sender = 'ServiceDetail - validate content' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'ServiceDetail content must be a string.', { content: value })

		const content = value.trim()

		if (content.length === 0)
			return apiResponse(false, sender, 401, 'ServiceDetail content cannot be empty.', { content })

		if (content.length < MIN_DETAIL_CONTENT_LENGTH)
			return apiResponse(false, sender, 402, `ServiceDetail content must be at least ${MIN_DETAIL_CONTENT_LENGTH} characters long.`, { content })

		if (content.length > MAX_DETAIL_CONTENT_LENGTH)
			return apiResponse(false, sender, 403, `ServiceDetail content cannot exceed ${MAX_DETAIL_CONTENT_LENGTH} characters.`, { content })

		return apiResponse(true, sender, 200, 'ServiceDetail content is valid.', { content })
	}

	/// IMAGE URL ///

	/** This image will be shown to the side of the text content. */
	get imageUrl(): ServiceDetailInfo['imageUrl'] { return this._imageUrl }

	/** Sets the image URL(s) of the service detail.
	 * 
	 * @param value - The image URL(s) to set.
	 * 
	 * If `undefined`, a default image URL will be set based on the service key and label.
	 * 
	 * The default URL format is: {@link DEFAULT_DETAIL_IMAGE_URL}
	 */
	set imageUrl(value: any) {
		const sender = 'ServiceDetail - set imageUrl' as const

		ServiceDetail.validateImageUrl(value).then(response => {
			if (response.passed)
				this._imageUrl = response.data!.imageUrl
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a service detail image URL(s).
	 *
	 * This static method checks if the provided value is a string, array of strings, `null`, or `undefined`.
	 * 
	 * If the value is `undefined`, it returns a default image URL based on the service key and label as defined by
	 * {@link DEFAULT_DETAIL_IMAGE_URL}.
	 * 
	 * If the value is `null`, it returns an empty array.
	 * 
	 * If the value is a string, it trims it and returns it in an array (or an empty array if it's empty).
	 * 
	 * If the value is an array, it trims each string and returns an array of valid URLs.
	 *
	 * @param value - The value to validate as a service detail image URL(s).
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateImageUrl(value: any): Promise<ApiResponse> {
		const sender = 'ServiceDetail - validate imageUrl' as const

		if (value === undefined) {
			const url = DEFAULT_DETAIL_IMAGE_URL.replace('{key}', '').replace('{label}', '')
			return apiResponse(true, sender, 202, 'ServiceDetail imageUrl is valid.', { imageUrl: [url] })
		}

		if (value === null)
			return apiResponse(true, sender, 203, 'ServiceDetail imageUrl is valid.', { imageUrl: [] })
		if (typeof value === 'string') {
			const url = value.trim()

			return url.length === 0
				? apiResponse(false, sender, 400, 'ServiceDetail imageUrl cannot be an empty string.', { imageUrl: url })
				: apiResponse(true, sender, 200, 'ServiceDetail imageUrl is valid.', { imageUrl: [url] })
		}

		if (Array.isArray(value)) {
			const urls = value.map((url: any) => {
				if (typeof url !== 'string') return null
				return url.trim()
			}).filter(Boolean)

			return apiResponse(true, sender, 201, 'ServiceDetail imageUrl is valid.', { imageUrl: urls })
		}

		return apiResponse(false, sender, 401, 'ServiceDetail imageUrl must be a string, array of strings, null, or undefined.', { imageUrl: value })
	}

	// #endregion Getters and Setters



	////////////////////////
	/// INSTANCE METHODS ///
	////////////////////////
	// #region Instance Methods

	display(): string { return `${this._label} - ${this._title}` }

	// #endregion Instance Methods



	//////////////////////
	/// STATIC METHODS ///
	//////////////////////
	// #region Static Methods

	static parse(input: string): ServiceDetail { return super.parse(input) }

	static async validate(values: any): Promise<ApiResponse> {
		return super.validate(values, {
			'label': { func: this.validateLabel },
			'title': { func: this.validateTitle },
			'content': { func: this.validateContent },
			'imageUrl': { func: this.validateImageUrl }
		})
	}

	// #endregion Static Methods
}

// #endregion Service Detail Class

// #endregion Service Detail Model
