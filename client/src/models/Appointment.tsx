// import axios from 'axios'
// import { apiResponse } from '../lib/apiResponse'

export interface IAppointment {
	id: string
	customerId: string
	serviceId: string
	employeeId: string
	datetime: string
	status: 'booked' | 'cancelled' | 'completed' | 'no-show'
}

class Appointment implements IAppointment {
	private _id: string
	private _customerId: string
	private _serviceId: string
	private _employeeId: string
	private _datetime: string
	private _status: IAppointment['status']

	constructor(data: IAppointment) {
		this._id = data.id
		this._customerId = data.customerId
		this._serviceId = data.serviceId
		this._employeeId = data.employeeId
		this._datetime = data.datetime
		this._status = data.status
	}

	get id() { return this._id }
	get customerId() { return this._customerId }
	get serviceId() { return this._serviceId }
	get employeeId() { return this._employeeId }
	get datetime() { return this._datetime }
	get status() { return this._status }
}

export default Appointment