// import axios from 'axios'
// import { apiResponse } from '../lib/apiResponse'

export interface ICustomerPreference {
	customerId: string
	option: string
	value: string
}

class CustomerPreference implements ICustomerPreference {
	private _customerId: string
	private _option: string
	private _value: string

	constructor(data: ICustomerPreference) {
		this._customerId = data.customerId
		this._option = data.option
		this._value = data.value
	}

	get customerId() { return this._customerId }
	get option() { return this._option }
	get value() { return this._value }
}

export default CustomerPreference