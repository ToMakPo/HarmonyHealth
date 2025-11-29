class ServiceProvider {
	private _serviceId: string
	private _employeeId: string
	private _duration: number

	constructor(data: ServiceProvider) {
		this._serviceId = data.serviceId
		this._employeeId = data.employeeId
		this._duration = data.duration
	}

	get serviceId() { return this._serviceId }
	get employeeId() { return this._employeeId }
	get duration() { return this._duration }
}

export default ServiceProvider