// import axios from 'axios'
// import { apiResponse } from '../lib/apiResponse'

export interface IService {
	id: string
	groupId?: string
	name: string
	description?: string
	details: string
	cost: number
	priceInfo?: string
	imagePath?: string
	sortOrder?: number
}

class Service implements IService {
	private _id: string
	private _groupId?: string
	private _name: string
	private _description?: string
	private _details: string
	private _cost: number
	private _priceInfo?: string
	private _imagePath?: string
	private _sortOrder?: number

	constructor(data: IService) {
		this._id = data.id
		this._groupId = data.groupId
		this._name = data.name
		this._description = data.description
		this._details = data.details
		this._cost = data.cost
		this._priceInfo = data.priceInfo
		this._imagePath = data.imagePath
		this._sortOrder = data.sortOrder
	}

	get id() { return this._id }
	get groupId() { return this._groupId }
	get name() { return this._name }
	get description() { return this._description }
	get details() { return this._details }
	get cost() { return this._cost }
	get priceInfo() { return this._priceInfo }
	get imagePath() { return this._imagePath }
	get sortOrder() { return this._sortOrder }
}

export default Service