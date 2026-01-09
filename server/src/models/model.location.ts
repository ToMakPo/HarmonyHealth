import { type ApiResponse, apiResponse } from "../lib/apiResponse"
import { Main, Model, ModelError, generateId, type UUID, validateId } from "./index.model"



/////////////////
/// CONSTANTS ///
/////////////////
// #region Constants

const MIN_DESCRIPTION_LENGTH = 10 as const
const MAX_DESCRIPTION_LENGTH = 500 as const
const DEFAULT_HERO_IMAGE_URL = '/images/locations/{key}/hero.png' as const

const MIN_DETAIL_CONTENT_LENGTH = 500 as const
const MAX_DETAIL_CONTENT_LENGTH = 5000 as const
const DEFAULT_DETAIL_IMAGE_URL = '/images/locations/{key}/detail/{label}.png' as const

// #endregion Constants



// #region -



/////////////////////
/// LOCATION MODEL ///
/////////////////////
// #region Location Model 



//////////////////
/// INTERFACES ///
//////////////////
// #region Interfaces

export interface LocationInfo {
	/** The unique identifier of the location. */
	id: UUID | string

	/** The name of the location. */
	name: string

	/** The location's physical address. */
	address: string

	/** The phone number for the specific location. */
	phone: string

	/** The email address for the specific location. */
	email: string

	/** Links to images associated with the location. */
	imageUrls: string[]
}

export interface LocationInit {
	/** The unique identifier of the location. If not provided, a new one will be generated. */
	id?: UUID | string

	/** The name of the location. */
	name: string

	/** The location's physical address. */
	address: string

	/** The phone number for the specific location. */
	phone: string

	/** The email address for the specific location. */
	email: string

	/** Links to images associated with the location. Requires at least one image. */
	imageUrls?: string[] | string
}

export interface LocationUpdate {
	/** The name of the location. */
	name?: UUID | string

	/** The location's physical address. */
	address?: string

	/** The phone number for the specific location. */
	phone?: string

	/** The email address for the specific location. */
	email?: string

	/** Links to images associated with the location. Requires at least one image. */
	imageUrls?: string[] | string
}

export interface LocationFilter {
	/** The unique identifier of the location. */
	id?: UUID | string | UUID[] | string[]

	/** The name of the location. (exact match, case-insensitive) */
	name?: string | string[]

	/** The location's physical address. (exact match, case-insensitive) */
	address?: string | string[]

	/** The phone number for the specific location. (exact match) */
	phone?: string | string[]

	/** The email address for the specific location. (exact match, case-insensitive) */
	email?: string | string[]
}

// #endregion Interfaces



/////////////////////
/// LOCATION CLASS ///
/////////////////////
// #region Location Class

class Location<T extends LocationInfo = LocationInfo> extends Model<T, LocationInit, LocationUpdate> implements LocationInfo {
	private _id = null as unknown as LocationInfo['id']
	private _name = null as unknown as LocationInfo['name']
	private _address = null as unknown as LocationInfo['address']
	private _phone = null as unknown as LocationInfo['phone']
	private _email = null as unknown as LocationInfo['email']
	private _imageUrls = null as unknown as LocationInfo['imageUrls']

	/** Creates a new Location instance.
	 * 
	 * @param params - The initialization
	 * 
	 * @throws `ModelError` If any of the provided data is invalid.
	 */
	constructor(params: LocationInit) { super(params) }

	///////////////////////////
	/// GETTERS AND SETTERS ///
	///////////////////////////
	// #region Getters and Setters

	/// ID ///

	/** The unique identifier of the location. */
	get id(): LocationInfo['id'] { return this._id }

	/** Sets the unique identifier of the location.
	 * 
	 * @param value - The unique identifier to set.
	 * 
	 * If no id is provided, a new one will be generated.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Location.validateId}
	 */
	protected set id(value: any) {
		const sender = 'Location - set id' as const

		Location.validateId(value).then(response => {
			if (response.passed)
				this._id = response.data!.valid as LocationInfo['id']
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a location id.
	 * 
	 * This static method checks if the provided value is a valid id. If no value is provided, it generates 
	 * a new id and returns it as valid.
	 * 
	 * @param value - The value to validate as a location id.
	 * 
	 * @returns An API response indicating the validation result.
	 */
	static async validateId(value: any): Promise<ApiResponse> {
		const sender = 'Location - validate id' as const

		if (value === undefined) {
			const id = generateId()
			return apiResponse(true, sender, 201, 'Location id is valid.', { value, valid: id })
		}

		return validateId(value)
			? apiResponse(true, sender, 200, 'Location id is valid.', { value, valid: value })
			: apiResponse(false, sender, 400, 'Location id is not valid.', { value })
	}

	/// NAME ///

	/** The name of the location. */
	get name(): LocationInfo['name'] { return this._name }

	/** Sets the name of the location.
	 * 
	 * @param value - The name to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Location.validateName}
	 */
	set name(value: any) {
		const sender = 'Location - set name' as const

		Location.validateName(value, this._id).then(response => {
			if (response.passed)
				this._name = response.data!.valid as LocationInfo['name']
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the uniqueness and format of a location name.
	 *
	 * This static method checks if the provided value is a string, trims it, and ensures it is not empty.
	 * It then queries for existing locations with the same name. If no such location exists, or if the only
	 * existing location matches the provided `ignoreId`, the name is considered valid and unique.
	 * Otherwise, it fails the validation.
	 *
	 * @param value - The value to validate as a location name.
	 * @param ignoreId - (Optional) An ID to ignore during uniqueness check, useful for updates.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateName(value: any, ignoreId?: UUID | string): Promise<ApiResponse> {
		const sender = 'Location - validate name' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Location name must be a string.', { value })

		const name = value.trim()

		if (name.length === 0)
			return apiResponse(false, sender, 401, 'Location name cannot be empty.', { value })

		const locations = await this.find({ name })

		if (locations.length === 0)
			return apiResponse(true, sender, 200, 'Location name is valid and unique.', { valid: name })

		if (locations.length === 1 && ignoreId && locations[0].id === ignoreId)
			return apiResponse(true, sender, 201, 'Location name is valid and unique.', { valid: name })

		return apiResponse(false, sender, 402, 'Location name must be unique.', { value })
	}

	/// ADDRESS ///

	/** The location's physical address. */
	get address(): LocationInfo['address'] { return this._address }

	/** Sets the address of the location.
	 * 
	 * @param value - The address to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Location.validateAddress}
	 */
	set address(value: any) {
		const sender = 'Location - set address' as const

		Location.validateAddress(value).then(response => {
			if (response.passed)
				this._address = response.data!.address as LocationInfo['address']
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a location address.
	 * 
	 * This static method checks if the provided value is a string and trims it. It ensures the address is not empty
	 * and is formated as a valid address.
	 * 
	 * @param value - The value to validate as a location address.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateAddress(value: any): Promise<ApiResponse> {
		const sender = 'Location - validate address' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Location address must be a string.', { value })

		const address = value.trim()

		if (address.length === 0)
			return apiResponse(false, sender, 401, 'Location address cannot be empty.', { value })

		return apiResponse(true, sender, 200, 'Location address is valid.', { value, valid: address })
	}

	/// PHONE ///

	/** The phone number for the specific location. */
	get phone(): LocationInfo['phone'] { return this._phone }

	/** Sets the phone number of the location.
	 * 
	 * @param value - The phone number to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Location.validatePhone}
	 */
	set phone(value: any) {
		const sender = 'Location - set phone' as const
	
		Location.validatePhone(value).then(response => {
			if (response.passed)
				this._phone = response.data!.phone as LocationInfo['phone']
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** A formatted display version of the location's phone number. */
	get phoneDisplay(): string {
		const [area, central, line, ext] = this._phone.match(/^(\d{3})(\d{3})(\d{4})(?:x(\d+))?$/)?.slice(1) ?? []
		return ext ? `(${area}) ${central}-${line} ex: ${ext}` : `(${area}) ${central}-${line}`
	}

	/** Validates the format of a location phone number.
	 * 
	 * This static method checks if the provided value is a string and trims it. It ensures the phone number is not empty
	 * and is formated as a valid phone number.
	 * 
	 * The value will be stripped of all non-numeric characters before validation.
	 * 
	 * @param value - The value to validate as a location phone number.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validatePhone(value: any): Promise<ApiResponse> {
		const sender = 'Location - validate phone' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Location phone must be a string.', { value })

		const phone = value.replace(/\D/g, '').replace(/^1/, '')

		if (phone.length === 0)
			return apiResponse(false, sender, 401, 'Location phone cannot be empty.', { value })

		if (phone.length < 10)
			return apiResponse(false, sender, 402, 'Location phone is too short.', { value, valid: phone })

		return apiResponse(true, sender, 200, 'Location phone is valid.', { value, valid: phone })
	}

	/// EMAIL ///

	/** The email address for the specific location. */
	get email(): LocationInfo['email'] { return this._email }

	/** Sets the email address of the location.
	 * 
	 * @param value - The email address to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Location.validateEmail}
	 */
	set email(value: any) {
		const sender = 'Location - set email' as const

		Location.validateEmail(value).then(response => {
			if (response.passed)
				this._email = response.data!.email as LocationInfo['email']
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of a location email address.
	 * 
	 * This static method checks if the provided value is a string and trims it. It ensures the email address is not empty
	 * and is formated as a valid email address.
	 * 
	 * @param value - The value to validate as a location email address.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateEmail(value: any): Promise<ApiResponse> {
		const sender = 'Location - validate email' as const

		if (typeof value !== 'string')
			return apiResponse(false, sender, 400, 'Location email must be a string.', { value })

		const email = value.trim().toLowerCase()

		if (email.length === 0)
			return apiResponse(false, sender, 401, 'Location email cannot be empty.', { value })

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!emailRegex.test(email))
			return apiResponse(false, sender, 402, 'Location email is not valid.', { value })

		return apiResponse(true, sender, 200, 'Location email is valid.', { value, valid: email })
	}

	/// IMAGE URLS ///

	/** Links to images associated with the location. */
	get imageUrls(): LocationInfo['imageUrls'] { return this._imageUrls }

	/** Sets the image URLs associated with the location.
	 * 
	 * @param value - The image URLs to set.
	 * 
	 * @throws `ModelError` If it fails validation. {@link Location.validateImageUrls}
	 */
	set imageUrls(value: any) {
		const sender = 'Location - set imageUrls' as const

		Location.validateImageUrls(value).then(response => {
			if (response.passed)
				this._imageUrls = response.data!.imageUrls as LocationInfo['imageUrls']
			else
				ModelError.throw(sender, response.code + 100, response.message, response.data)
		})
	}

	/** Validates the format of location image URLs.
	 * 
	 * This static method checks if the provided value is a string or an array of strings. It trims each URL and ensures there
	 * is at least one valid URL.
	 * 
	 * @param value - The value to validate as location image URLs.
	 * 
	 * @returns A promise resolving to an API response indicating the validation result.
	 */
	static async validateImageUrls(value: any): Promise<ApiResponse> {
		const sender = 'Location - validate imageUrls' as const

		if (typeof value === 'string') 
			return this.validateImageUrls([value])

		if (!Array.isArray(value))
			return apiResponse(false, sender, 400, 'Location imageUrls must be a string or an array of strings.', { value })

		const imageUrls = value.map((url: any) => typeof url !== 'string' ? null : url.trim()).filter(Boolean)

		if (imageUrls.length === 0)
			return apiResponse(false, sender, 401, 'Location imageUrls must contain at least one valid URL.', { value })

		return apiResponse(true, sender, 200, 'Location imageUrls are valid.', { value, valid: imageUrls })
	}

	// #endregion Getters and Setters



	////////////////////////
	/// INSTANCE METHODS ///
	////////////////////////
	// #region Instance Methods

	display(): string { return `${this._name} Location (${this._id})` }

	async delete(): Promise<this> { ModelError.throw('Location - delete', 400, 'Method not implemented.') }

	async save(): Promise<this> { ModelError.throw('Location - save', 400, 'Method not implemented.') }

	// #endregion Instance Methods


	//////////////////////
	/// STATIC METHODS ///
	//////////////////////
	// #region Static Methods

	static parse(string: string): Location { return super.parse(string) }

	static async find(filters: LocationFilter): Promise<Location[]> { return await super.find(filters) }

	static async insert(init: LocationInit): Promise<Location> { return await super.insert(init) }

	static async update(filters: LocationFilter, params: LocationUpdate): Promise<Location[]> { return await super.update(filters, params) }

	static async delete(filters: LocationFilter): Promise<Location[]> { return await super.delete(filters) }

	static async validate(values: any): Promise<ApiResponse> {
		return super.validate(values, {
			'id': { func: this.validateId },
			'name': { func: this.validateName, args: [values.id] },
			'address': { func: this.validateAddress },
			'phone': { func: this.validatePhone },
			'email': { func: this.validateEmail },
			'imageUrls': { func: this.validateImageUrls }
		})
	}

	// #endregion Static Methods
}

export default Location

// #endregion Location Class

// #endregion Location Model
