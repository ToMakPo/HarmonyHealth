class EmployeePreference {
	private _employeeId: string
	private _option: string
	private _value: string

	constructor(data: EmployeePreference) {
		this._employeeId = data.employeeId
		this._option = data.option
		this._value = data.value
	}

	get employeeId() { return this._employeeId }
	get option() { return this._option }
	get value() { return this._value }
}

export default EmployeePreference