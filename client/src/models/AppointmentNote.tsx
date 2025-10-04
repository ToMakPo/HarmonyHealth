// import axios from 'axios'
// import { apiResponse } from '../lib/apiResponse'

export interface IAppointmentNote {
	id: string
	appointmentId: string
	employeeId: string | null
	timestamp: string
	noteType: 'internal' | 'activity' | 'reminder' | 'instruction'
}

class AppointmentNote implements IAppointmentNote {
	private _id: string
	private _appointmentId: string
	private _employeeId: string | null
	private _timestamp: string
	private _noteType: IAppointmentNote['noteType']

	constructor(data: IAppointmentNote) {
		this._id = data.id
		this._appointmentId = data.appointmentId
		this._employeeId = data.employeeId
		this._timestamp = data.timestamp
		this._noteType = data.noteType
	}

	get id() { return this._id }
	get appointmentId() { return this._appointmentId }
	get employeeId() { return this._employeeId }
	get timestamp() { return this._timestamp }
	get noteType() { return this._noteType }
}

export default AppointmentNote