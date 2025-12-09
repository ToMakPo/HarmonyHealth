class Appointment {
	private _id: string
	private _customerId: string
	private _serviceId: string
	private _employeeId: string
	private _datetime: string
	private _status: 'booked' | 'cancelled' | 'completed' | 'no-show'

	constructor(data: Appointment) {
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