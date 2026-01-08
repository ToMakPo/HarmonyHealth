///////////////////////
/// BASE MAIN CLASS ///
///////////////////////
// #region Base Main Class

export abstract class Main<Info extends object, Init extends object, Update extends Partial<Init> = Partial<Init>> {
	/** Creates a clone of the instance.
	 * 
	 * @param props An optional object containing properties to override in the clone.
	 * @return A new instance that is a clone of the original with any specified properties overridden.
	 */
	clone(props?: Partial<Init>): this {
		const init = this.toInit()
		const combined = { ...init, ...props }
		return new (this.constructor as new (props: any) => this)(combined)
	}

	/** Safely updates multiple properties of the instance without saving.
	 * 
	 * @param props An object containing the properties to update.
	 * @return The updated instance.
	 * @throws {SchedulingError} If any property update is invalid.
	 */
	set(props: Update | undefined | null | string): this {
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
					ModelError.throw(400, `${this.constructor.name} - set`, `Property '${key}' does not exist on ${this.constructor.name}.`)
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
				ModelError.throw(401, `${this.constructor.name} - set`, 'An unexpected error occurred while setting properties.', { originalError: error })
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

	/** Parses an instance from a string representation. */
	static parse<T extends Main<any, any, any>>(this: new (props: any) => T, string: string): T {
		if (!string.startsWith(`${this.name}(`) || !string.endsWith(')'))
			ModelError.throw(400, `${this.name} - parse`, `Invalid ${this.name} string format.`)

		const jsonString = string.slice(this.name.length + 1, -1)
		const data = JSON.parse(jsonString) as Record<string, any>
		return new this(data)
	}
}



//////////////////
/// BASE MODEL ///
//////////////////
// #region Base Model

export abstract class Model<Info extends Object, Init extends Object, Update extends Partial<Init> = Partial<Init>> extends Main<Info, Init, Update> {
	/** Safely updates multiple properties of the instance and saves the changes.
	 * 
	 * @param props An object containing the properties to update.
	 * @return A promise that resolves to the updated instance after saving.
	 * @throws SchedulingError if any property update is invalid or if saving fails.
	 */
	update(props: Update): Promise<this> {
		this.set(props)
		return this.save()
	}

	/** Saves the current state of the instance.
	 * 
	 * @return A promise that resolves to the saved instance.
	 * @throws SchedulingError if saving fails.
	 */
	async save(): Promise<this> {
		// TODO: Implement save logic (e.g., database save)
		console.warn('Model.save is not implemented yet.', this)

		return this
	}

	/** Deletes the instance.
	 * 
	 * @return A promise that resolves when the instance has been deleted.
	 * @throws SchedulingError if deletion fails.
	 */
	async delete(): Promise<void> {
		// TODO: Implement delete logic (e.g., database delete)
		console.warn('Model.delete is not implemented yet.', this)
	}

	/** Finds instances that match the specified filter criteria.
	 * 
	 * @param filter An object containing the filter criteria.
	 * @return A promise that resolves to an array of instances that match the filter.
	 * @throws SchedulingError if the find operation fails.
	 */
	static async find<T extends Model<any, any, any>, filterT extends Object>(this: new (props: any) => T, filter: filterT): Promise<T[]> {
		// TODO: Implement find logic (e.g., database query)
		console.warn('Model.find is not implemented yet.', this, filter)
		return [] as T[]
	}

	/* OVERRIDE EXAMPLE *
	static override async find<T extends Model<any, any>, filterT extends AppointmentFilter>(
		this: new (props: any) => T,
		filters: filterT
	): Promise<T[]> {
		return super.find.call(this, filters) as Promise<T[]>;
	}
	/* */
}



/////////////////////////
/// MODEL ERROR CLASS ///
/////////////////////////
// #region Model Error Class

export class ModelError extends Error {
	private _code: number
	private _sender: string
	private _message: string
	private _data: Record<string, any> | null

	/**
	 * Constructs a new instance of the error.
	 * 
	 * @param code - A numeric code representing the status or type of the message.
	 * @param sender - A string identifier for the sender of the message.
	 * @param message - A string containing the message to be conveyed.
	 * @param data - Optional additional data associated with the message, represented as a record of key-value pairs. Defaults to null if not provided.
	 */
	constructor(code: number, sender: string, message: string, data?: Record<string, any> | null) {
		super(message)
		this._code = code
		this._sender = sender
		this._message = message
		this._data = data || null
	}

	/// ID ///
	private set id (value: string) {
		this._id = value
	}

	/** The error code associated with this error. */
	get code(): number { return this._code }

	/** The identifier of the sender that generated this error. */
	get sender(): string { return this._sender }

	/** The error message. */
	get message(): string { return this._message }

	/** Additional data associated with this error, if any. */
	get data(): Record<string, any> | null { return this._data }

	/** Returns a string representation of the SchedulingError. */
	toString(): string {
		return `${this.constructor.name}(${this._code}, ${this._sender}):\n${this._message}`
	}

	/** Throws a SchedulingError with the specified parameters. */
	static throw(code: number, sender: string, message: string, data?: Record<string, any> | null): never {
		throw new ModelError(code, sender, message, data)
	}
}



//////////////////////
/// UUID UTILITIES ///
//////////////////////
// #region UUID

export type UUID = string

export function generateId(): UUID {
	return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
}

export function validateId(id: string): boolean {
	const uuidRegex = /^[a-zA-Z0-9]{16}$/
	return uuidRegex.test(id)
}