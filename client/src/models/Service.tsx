import type { ApiResponse } from "../lib/apiResponse"
import { getServerUrl } from "../lib/utils"

interface Filters {
	id?: string
	name?: string
	description?: string
	details?: string
	topService?: boolean
	sId?: string
	sName?: string
	sDescription?: string
	sCost?: number
	sMinCost?: number
	sMaxCost?: number
	sPrice?: number
	sMinPrice?: number
	sMaxPrice?: number
	sDuration?: number
	sMinDuration?: number
	sMaxDuration?: number
}

class Service {
	private _id: string
	private _name: string
	private _description: string
	private _details: string
	private _sortOrder: number
	private _topService: boolean
	private _packages: Package[]

	constructor(data: Service) {
		this._id = data.id
		this._name = data.name
		this._description = data.description
		this._details = data.details
		this._sortOrder = data.sortOrder
		this._topService = data.topService
		this._packages = (data.packages || []).map(ss => new Package(ss))
	}

	get id() { return this._id }
	get name() { return this._name }
	get description() { return this._description }
	get details() { return this._details }
	get sortOrder() { return this._sortOrder }
	get topService() { return this._topService }
	get packages() { return [...this._packages] }

	static async find(filters: Filters = {}) {
		const queryParams = new URLSearchParams(filters as Record<string, string>).toString()
		const res = await fetch(getServerUrl() + `/api/service?${queryParams}`, {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' }
		})

		const response: ApiResponse = await res.json()

		if (!response.passed) return []

		return (response.data as Service[]).map((serviceData: Service) => new Service(serviceData))
	}
}

class Package {
	private _id: string
	private _name: string
	private _description: string
	private _cost: number
	private _price: number
	private _duration: number
	private _sortOrder?: number

	constructor(data: Package) {
		this._id = data.id
		this._name = data.name
		this._description = data.description
		this._cost = data.cost
		this._price = data.price
		this._duration = data.duration
		this._sortOrder = data.sortOrder
	}

	get id() { return this._id }
	get name() { return this._name }
	get description() { return this._description }
	get cost() { return this._cost }
	get price() { return this._price }
	get duration() { return this._duration }
	get sortOrder() { return this._sortOrder }
}

export default Service