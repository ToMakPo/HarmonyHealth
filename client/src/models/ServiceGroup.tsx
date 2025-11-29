class ServiceGroup {
	private _id: string
	private _name: string
	private _sortOrder?: number

	constructor(data: ServiceGroup) {
		this._id = data.id
		this._name = data.name
		this._sortOrder = data.sortOrder
	}

	get id() { return this._id }
	get name() { return this._name }
	get sortOrder() { return this._sortOrder }
}

export default ServiceGroup