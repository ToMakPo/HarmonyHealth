// import axios from 'axios'
// import { apiResponse } from '../lib/apiResponse'

export interface ICustomer {
	id: string
	username: string
	passHash: string
	firstName: string
	lastName: string
	title?: string
	email: string
	phone?: string
	address?: string
	gender?: string
	dob?: string
	notes?: string
	imagePath?: string
	status?: string
}

class Customer implements ICustomer {
	private _id: string
	private _username: string
	private _passHash: string
	private _firstName: string
	private _lastName: string
	private _title?: string
	private _email: string
	private _phone?: string
	private _address?: string
	private _gender?: string
	private _dob?: string
	private _notes?: string
	private _imagePath?: string
	private _status?: string

	constructor(data: ICustomer) {
		this._id = data.id
		this._username = data.username
		this._passHash = data.passHash
		this._firstName = data.firstName
		this._lastName = data.lastName
		this._title = data.title
		this._email = data.email
		this._phone = data.phone
		this._address = data.address
		this._gender = data.gender
		this._dob = data.dob
		this._notes = data.notes
		this._imagePath = data.imagePath
		this._status = data.status
	}

	get id() { return this._id }
	get username() { return this._username }
	get passHash() { return this._passHash }
	get firstName() { return this._firstName }
	get lastName() { return this._lastName }
	get title() { return this._title }
	get email() { return this._email }
	get phone() { return this._phone }
	get address() { return this._address }
	get gender() { return this._gender }
	get dob() { return this._dob }
	get notes() { return this._notes }
	get imagePath() { return this._imagePath }
	get status() { return this._status }
}

export default Customer