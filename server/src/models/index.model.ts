import { apiResponse, ApiResponse } from "../lib/apiResponse"



///////////////////////
/// BASE MAIN CLASS ///
///////////////////////
// #region Base Main Class

type ValidatorType = { func: (value: any, ...args: any[]) => Promise<ApiResponse>, args?: any[] }

export abstract class Main<Info extends object, Init extends object, Update extends Partial<Init> = Partial<Init>> {
	constructor(params: Init) {
		const sender = `${this.constructor.name} - constructor` as const

		// Initialize each property.
		for (const [key, value] of Object.entries(params)) {
			if (key in this) {
				(this as any)[key] = value
			} else {
				ModelError.throw(sender, 400, `Property '${key}' does not exist on ${this.constructor.name}.`)
			}
		}
	}

	/** Creates a clone of the instance.
	 * 
	 * @param props An optional object containing properties to override in the clone.
	 * 
	 * @return A new instance that is a clone of the original with any specified properties overridden.
	 * 
	 * @throws `ModelError` If the cloning process fails.
	 */
	clone(props?: Partial<Init>): this {
		const init = this.toInit()
		const combined = { ...init, ...props }
		return new (this.constructor as new (props: any) => this)(combined)
	}

	/** Safely updates multiple properties of the instance without saving.
	 * 
	 * @param props An object containing the properties to update.
	 * 
	 * @return The updated instance.
	 * 
	 * @throws `ModelError` If any property update is invalid.
	 */
	set(props: Update | undefined | null | string): this {
		const sender = `${this.constructor.name} - set` as const

		if (!props) return this

		if (typeof props === 'string') {
			props = (this.constructor as any).parse(props) as Update
		}

		const oldValues = {} as Update

		try {
			// Update each property.
			for (const [key, value] of Object.entries(props)) {
				if (key in this) {
					(this as any)[key] = value
					oldValues[key as keyof Update] = (this as any)[key]
				} else {
					ModelError.throw(sender, 400, `Property '${key}' does not exist on ${this.constructor.name}.`)
				}
			}
		} catch (error) {
			// Revert to old values on error.
			for (const [key, value] of Object.entries(oldValues)) {
				(this as any)[key] = value
			}

			// Rethrow the error as a ModelError.
			if (error instanceof ModelError) {
				throw error
			} else {
				ModelError.throw(sender, 401, 'An unexpected error occurred while setting properties.',
					{ originalError: error })
			}
		}

		return this
	}

	/** Displays the instance in a readable format. */
	abstract display(): string

	/** Converts the instance to a JSON object. */
	toJSON(): Info {
		return Object.entries(this).reduce((obj: any, [key, value]: any) => {
			if (key in ({} as Info)) (obj as any)[key] = value
			return obj
		}, {} as any) as Info
	}

	/** Converts the instance to an initialization object. */
	toInit(): Init {
		return Object.entries(this).reduce((obj: any, [key, value]: any) => {
			if (key in ({} as Init)) (obj as any)[key] = value
			return obj
		}, {} as any) as Init
	}

	/** A detailed string representation of the instance. */
	toString(): string {
		return `${this.constructor.name}(${JSON.stringify(this.toInit())})`
	}

	/** Parses an instance from a string representation. 
	 * 
	 * @param input The string to parse.
	 * 
	 * @return A new instance created from the parsed data.
	 * 
	 * @throws `ModelError` If the string format is invalid.
	 */
	protected static parse(input: string) {
		const sender = `${this.name} - parse` as const

		if (!input.startsWith(`${this.name}(`) || !input.endsWith(')'))
			ModelError.throw(sender, 400, `Invalid ${this.name} string format.`)

		const jsonString = input.slice(this.name.length + 1, -1)
		const data = JSON.parse(jsonString) as Record<string, any>
		return new (this as any)(data)
	}

	/** Validates the provided values against the specified validators.
	 * 
	 * @param values The values to validate.
	 * 
	 * @return An ApiResponse indicating the result of the validation.
	 */
	protected static async validate(values: any, validators: Record<string, ValidatorType>): Promise<ApiResponse> {
		const sender = `${this.name} - validate` as const

		let obj = values
		let passed = true
		const responses = {} as Record<string, ApiResponse>
		const validValues = {} as Record<string, any>

		// If a string is provided, attempt to parse it as JSON.
		if (typeof values === 'string') {
			if (values.startsWith(this.name + '{') && values.endsWith('}')) {
				obj = JSON.parse(values.slice(this.name.length, -1))
			} else {
				obj = JSON.parse(values)
			}
		}

		// Ensure we have an object with key-value pairs.
		if (!(obj instanceof Object) || Array.isArray(obj))
			return apiResponse(false, sender, 401, `${this.name} validation failed. Provided string could not be parsed to an object.`, { value: values })

		const data = obj as Record<string, any>

		// Validate each provided key, ignoring unknown keys.
		await Promise.all(Object.entries(data).filter(([key]) => key in validators).map(async ([key, value]) => {
			const validator = validators[key]

			const response = await validator.func(value, ...(validator.args || []))

			responses[key] = response

			if (response.passed) {
				validValues[key] = response.data && 'valid' in response.data ? response.data.valid : undefined
			} else {
				passed = false
			}
		}))

		// Return the overall validation result.
		return passed
			? apiResponse(true, sender, 200, `${this.name} validation passed.`, { value: values, valid: validValues, data, responses })
			: apiResponse(false, sender, 400, `${this.name} validation failed.`, { value: values, valid: validValues, data, responses })
	}
}

// #endregion Base Main Class



//////////////////
/// BASE MODEL ///
//////////////////
// #region Base Model

export abstract class Model<Info extends object, Init extends object, Update extends object = Partial<Init>> extends
	Main<Info, Init, Update> {
	////////////////////////
	/// INSTANCE METHODS ///
	////////////////////////
	// #region Instance Methods

	/** Safely updates multiple properties of the instance and saves the changes.
	 * 
	 * @param props An object containing the properties to update.
	 * 
	 * @return A promise that resolves to the updated instance after saving.
	 * 
	 * @throws `ModelError` If any property update is invalid or if saving fails.
	 */
	async update(props: Update): Promise<this> {
		this.set(props)
		return await this.save()
	}

	/** Deletes the instance.
	 * 
	 * @return A promise that resolves when the instance has been deleted.
	 * 
	 * @throws `ModelError` If deletion fails.
	 */
	abstract delete(): Promise<this>

	/** Saves the current state of the instance.
	 * 
	 * @return A promise that resolves to the saved instance.
	 * 
	 * @throws `ModelError` If saving fails.
	 */
	abstract save(): Promise<this>

	// #endregion Instance Methods



	//////////////////////
	/// STATIC METHODS ///
	//////////////////////
	// #region Static Methods

	/** Finds instances matching the provided filters.
	 * 
	 * @param filters An object containing key-value pairs to filter the search.
	 * 
	 * @return A promise that resolves to an array of instances matching the filters.
	 * 
	 * @throws `ModelError` If the find operation fails.
	 */
	protected static async find(filters: Record<string, any>): Promise<any[]> {
		ModelError.throw(`${this.name} - find`, 500, 'Method not implemented.', { filters })
	}

	/** Inserts a new instance with the provided properties.
	 * 
	 * @param props An object containing the properties for the new instance.
	 * 
	 * @return A promise that resolves to the newly created instance.
	 * 
	 * @throws `ModelError` If the insert operation fails.
	 */
	protected static async insert(props: Record<string, any>): Promise<any> {
		return await new (this as any)(props).save()
	}

	/** Updates instances matching the provided filters with the given properties.
	 * 
	 * @param filters An object containing key-value pairs to filter the instances to update.
	 * @param params An object containing the properties to update.
	 * 
	 * @return A promise that resolves to an array of updated instances.
	 * 
	 * @throws `ModelError` If the update operation fails.
	 */
	protected static async update(filters: Record<string, any>, params: Record<string, any>): Promise<any[]> {
		const results = await (this as any).find(filters)
		return await Promise.all(results.map(async (item: any) => await item.update(params)))
	}

	/** Deletes instances matching the provided filters.
	 * 
	 * @param filters An object containing key-value pairs to filter the instances to delete.
	 * 
	 * @return A promise that resolves to an array of deleted instances.
	 * 
	 * @throws `ModelError` If the delete operation fails.
	 */
	protected static async delete(filters: Record<string, any>): Promise<any[]> {
		const results = await (this as any).find(filters)
		return await Promise.all(results.map(async (item: any) => await item.delete()))
	}

	// #endregion Static Methods
}



/////////////////////////
/// MODEL ERROR CLASS ///
/////////////////////////
// #region Model Error Class

export class ModelError extends Error {
	private _sender: string
	private _code: number
	private _message: string
	private _data: Record<string, any> | null

	/**
	 * Constructs a new instance of the error.
	 * 
	 * @param sender - A string identifier for the sender of the message.
	 * @param code - A numeric code representing the status or type of the message.
	 * @param message - A string containing the message to be conveyed.
	 * @param data - Optional additional data associated with the message, represented as a record of key-value pairs. Defaults to null if 
	 * not provided.
	 */
	constructor(sender: string, code: number, message: string, data?: Record<string, any> | null) {
		super(message)
		this._sender = sender
		this._code = code
		this._message = message
		this._data = data || null
	}

	/** The identifier of the sender that generated this error. */
	get sender(): string { return this._sender }

	/** The error code associated with this error. */
	get code(): number { return this._code }

	/** The error message. */
	get message(): string { return this._message }

	/** Additional data associated with this error, if any. */
	get data(): Record<string, any> | null { return this._data }

	/** Returns a string representation of the SchedulingError. */
	toString(): string {
		return `${this.constructor.name}(${this._code}, ${this._sender}):\n${this._message}`
	}

	/** Throws a SchedulingError with the specified parameters. */
	static throw(sender: string, code: number, message: string, data?: Record<string, any> | null): never {
		throw new ModelError(sender, code, message, data)
	}
}



//////////////////////
/// UUID UTILITIES ///
//////////////////////
// #region UUID

export type UUID = string

/** Generates a pseudo-random UUID string.
 * 
 * @returns A UUID string composed of two concatenated random segments.
 */
export function generateId(): UUID {
	return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
}

/** Validates whether a given string is a valid UUID.
 * 
 * @param id The string to validate as a UUID.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function validateId(id: string): boolean {
	const uuidRegex = /^[a-zA-Z0-9]{16}$/
	return uuidRegex.test(id)
}