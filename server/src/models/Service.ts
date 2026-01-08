import { Main, Model, ModelError, generateId, UUID, validateId } from "."



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

	/** The unique key of the service. */
	key?: string

	/** The name of the service. */
	name: string

	/** A brief description of the service. */
	description: string

	/** The URL of the image representing the service. */
	imageUrl?: string

	/** Whether to feature this service on the home page. */
	topService?: boolean

	/** The detailed sections for the service page. */
	details: (ServiceDetailInit | string)[]
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

export class Service extends Model<ServiceInfo, ServiceInit, ServiceUpdate> implements ServiceInfo {
	private _id = null as unknown as ServiceInfo['id']
	private _key = null as unknown as ServiceInit['key']
	private _name = null as unknown as ServiceInfo['name']
	private _description = null as unknown as ServiceInfo['description']
	private _imageUrl = null as unknown as ServiceInfo['imageUrl']
	private _topService = null as unknown as ServiceInfo['topService']
	private _details = null as unknown as ServiceDetail[]

	constructor(data: ServiceInit) {
		super()
		this.set(data)
	}

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
	 * @throws `ModelError` If the provided id is not valid.
	 */
	protected set id(value: ServiceInit['id']) {
		const sender = 'Service - set id' as const

		if (value === undefined) {
			this._id = generateId()
			return
		}

		if (!validateId(value))
			ModelError.throw(400, sender, 'Service id is not valid.')

		this._id = value
	}

	/// KEY ///
	
	/** The unique key of the service.
	 * 
	 * If no key is set, it will be generated from the name.
	 */
	get key(): ServiceInfo['key'] { return this._key ?? this._name.toLowerCase().replace(/\s+/g, '-') }

	/** Sets the unique key of the service.
	 * 
	 * @param value - The unique key for the service or `undefined` to auto-generate from the name.
	 * 
	 * @throws `ModelError` If the provided key is not unique or is an empty string.
	 */
	set key(value: ServiceInit['key']) {
		const sender = 'Service - set key' as const

		const oldKey = this._key

		if (value === undefined) {
			this._key = undefined

			// Check for uniqueness.
			const newKey = this._name.trim().toLowerCase().replace(/\s+/g, '-')

			this.keyIsUnique(newKey).then(isUnique => {
				if (!isUnique) {
					this._key = oldKey
					ModelError.throw(400, sender, `Unsetting key causes generated key '${newKey}' to not be unique.`)
				}
			})
		} else {
			const newKey = value.trim().toLowerCase().replace(/\s+/g, '-')
			this._key = newKey

			if (value.length === 0)
				ModelError.throw(401, sender, 'Service key cannot be empty.')
			
			// Check for uniqueness.
			this.keyIsUnique(newKey).then(isUnique => {
				if (!isUnique) {
					this._key = oldKey
					ModelError.throw(402, sender, `Service key '${newKey}' is not unique.`)
				}
			})
		}
	}

	/// NAME ///

	/** The name of the service. */
	get name(): ServiceInfo['name'] { return this._name }

	/** Sets the name of the service.
	 * 
	 * @param value - The name to set.
	 * 
	 * @throws `ModelError` If the provided name is an empty string.
	 */
	set name(value: ServiceInit['name']) {
		const sender = 'Service - set name' as const

		const oldName = this._name
		const newName = value.trim()

		// If the name is empty, throw an error.
		if (value.trim().length === 0)
			ModelError.throw(400, sender, 'Service name cannot be empty.')

		this._name = newName

		// If the key is undefined, check if the generated key is unique.
		if (this._key !== undefined) return

		const generatedKey = newName.toLowerCase().replace(/\s+/g, '-')

		this.keyIsUnique(generatedKey).then(isUnique => {
			if (!isUnique) {
				this._name = oldName
				ModelError.throw(401, sender, `Changing name causes generated key '${generatedKey}' to not be unique.`)
			}
		})
	}

	/// DESCRIPTION ///

	/** The brief description of the service. */
	get description(): ServiceInfo['description'] { return this._description }

	/** Sets the brief description of the service.
	 * 
	 * @param value - The description to set.
	 * 
	 * @throws `ModelError` If the description is too short or too long.
	 */
	set description(value: ServiceInit['description']) {
		const sender = 'Service - set description' as const

		const newDescription = value.trim()

		// If the description is empty, throw an error.
		if (newDescription.length === 0)
			ModelError.throw(400, sender, 'Service description cannot be empty.')

		if (newDescription.length < MIN_DESCRIPTION_LENGTH)
			ModelError.throw(401, sender, `Service description must be at least ${MIN_DESCRIPTION_LENGTH} characters long.`)

		if (newDescription.length > MAX_DESCRIPTION_LENGTH)
			ModelError.throw(402, sender, `Service description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`)

		this._description = newDescription
	}

	/// IMAGE URL ///

	/** The URL of the image representing the service. */
	get imageUrl(): ServiceInfo['imageUrl'] { return this._imageUrl }

	/** Sets the URL of the image representing the service.
	 * 
	 * @param value - The image URL to set.
	 * 
	 * @throws `ModelError` If the image URL is an empty string.
	 */
	set imageUrl(value: ServiceInit['imageUrl']) {
		const sender = 'Service - set imageUrl' as const

		if (value === undefined) {
			this._imageUrl = DEFAULT_HERO_IMAGE_URL.replace('{key}', this.key)
			return
		}

		const url = value.trim()

		if (url.length === 0)
			ModelError.throw(400, sender, 'Service imageUrl cannot be an empty string.')

		this._imageUrl = url
	}

	/// TOP SERVICE ///

	/** Whether to feature this service on the home page. */
	get topService(): ServiceInfo['topService'] { return this._topService }

	/** Sets whether to feature this service on the home page.
	 * 
	 * @param value - Whether to feature this service on the home page.
	 */
	set topService(value: ServiceInit['topService']) {
		const sender = 'Service - set topService' as const

		if (value === undefined) {
			this._topService = false
			return
		}

		this._topService = value
	}

	/// DETAILS ///

	/** The detailed sections for the service page. */
	get details(): ServiceDetail[] { return [...this._details] }

	/** Sets the detailed sections for the service page.
	 * 
	 * @param value - The detailed sections to set.
	 * 
	 * @throws `ModelError` There are no details provided or if any detail is invalid.
	 */
	protected set details(value: ServiceInit['details']) {
		const sender = 'Service - set details' as const

		if (value.length === 0)
			ModelError.throw(400, sender, 'Service must have at least one detail section.')

		const details = [] as ServiceDetail[]

		for (const item of value) {
			if (typeof item === 'string') {
				details.push(ServiceDetail.parse(item))
			} else {
				details.push(new ServiceDetail(item))
			}
		}

		this._details = details
	}

	/** Adds a detailed section to the service page.
	 * 
	 * @param value - The detail to add.
	 * @param index - The index to insert the detail at. If not provided, the detail will be added to the end.
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
			ModelError.throw(400, sender, 'Invalid service detail provided to addDetail.')

		if (index !== undefined) {
			if (index < 0 || index > this._details.length)
				ModelError.throw(401, sender, 'Index out of bounds when adding service detail.')

			this._details.splice(index, 0, detail)
		} else this._details.push(detail)
		
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
			ModelError.throw(400, sender, 'Service detail to remove not found.')

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
			ModelError.throw(400, sender, 'Service detail to edit not found.')

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
			ModelError.throw(400, sender, 'Service detail to move not found.')

		if (newIndex < 0 || newIndex >= this._details.length)
			ModelError.throw(401, sender, 'New index for service detail is out of bounds.')

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

	private async keyIsUnique(key: string): Promise<boolean> {
		return Service.find({ key }).then(services => services.length === 0 || (services.length === 1 && services[0].id === this._id))
	}

	/** Displays the service in a readable format. */
	display(): string {
		return `${this._name} Service (${this._id})`
	}

	// #endregion Instance Methods
}

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

export class ServiceDetail extends Main<ServiceDetailInfo, ServiceDetailInit, ServiceDetailUpdate> implements ServiceDetailInfo {
	private _label = null as unknown as ServiceDetailInfo['label']
	private _title = null as unknown as ServiceDetailInfo['title']
	private _content = null as unknown as ServiceDetailInfo['content']
	private _imageUrl = null as unknown as ServiceDetailInfo['imageUrl']

	constructor(data: ServiceDetailInit) {
		super()
		this.set(data)
	}

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
	 * @throws `ModelError` If the label is an empty string.
	 */
	set label(value: ServiceDetailInit['label']) {
		const sender = 'ServiceDetail - set label' as const

		const newLabel = value.trim()

		// If the label is empty, throw an error.
		if (newLabel.length === 0)
			ModelError.throw(400, sender, 'ServiceDetail label cannot be empty.')

		this._label = newLabel
	}

	/// TITLE ///

	/** This will be the main heading of the section displayed prominently. */
	get title(): ServiceDetailInfo['title'] { return this._title }

	/** Sets the title of the service detail.
	 * 
	 * @param value - The title to set.
	 * 
	 * @throws `ModelError` If the title is an empty string.
	 */
	set title(value: ServiceDetailInit['title']) {
		const sender = 'ServiceDetail - set title' as const
		
		const newTitle = value.trim()

		// If the title is empty, throw an error.
		if (newTitle.length === 0)
			ModelError.throw(400, sender, 'ServiceDetail title cannot be empty.')

		this._title = newTitle
	}

	/// CONTENT ///

	/** These will be displayed as paragraphs within the section. */
	get content(): ServiceDetailInfo['content'] { return this._content }

	/** Sets the content of the service detail.
	 * 
	 * @param value - The content to set.
	 * 
	 * @throws `ModelError` If the content is too short or too long.
	 */
	set content(value: ServiceDetailInit['content']) {
		const sender = 'ServiceDetail - set content' as const

		const newContent = value.trim()

		// If the content is empty, throw an error.
		if (newContent.length === 0)
			ModelError.throw(400, sender, 'ServiceDetail content cannot be empty.')

		if (newContent.length < MIN_DETAIL_CONTENT_LENGTH)
			ModelError.throw(401, sender, `ServiceDetail content must be at least ${MIN_DETAIL_CONTENT_LENGTH} characters long.`)

		if (newContent.length > MAX_DETAIL_CONTENT_LENGTH)
			ModelError.throw(402, sender, `ServiceDetail content cannot exceed ${MAX_DETAIL_CONTENT_LENGTH} characters.`)

		this._content = newContent
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
	set imageUrl(value: ServiceDetailInit['imageUrl']) {
		const sender = 'ServiceDetail - set imageUrl' as const

		if (value === undefined) {
			const url = DEFAULT_DETAIL_IMAGE_URL.replace('{key}', '').replace('{label}', this._label.toLowerCase().replace(/\s+/g, '-'))
			this._imageUrl = [url]
			return
		}

		if (value === null) {
			this._imageUrl = [] 
			return
		}

		if (typeof value === 'string') {
			const url = value.trim()
			
			this._imageUrl = url.length === 0 ? [] : [url]
			return
		}

		const urls = value.map(url => url.trim()).filter(Boolean)
		this._imageUrl = urls
	}

	// #endregion Getters and Setters



	////////////////////////
	/// INSTANCE METHODS ///
	////////////////////////
	// #region Instance Methods

	/** Displays the service detail in a readable format. */
	display(): string {
		return `${this._label} - ${this._title}`
	}

	// #endregion Instance Methods
}

// #endregion Service Detail Class

// #endregion Service Detail Model