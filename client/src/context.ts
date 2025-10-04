import React from 'react'
import Employee from './models/Employee'
import Customer from './models/Customer'

export interface IGlobalContext {
	activeUser: Customer | Employee | null
	setActiveUser: React.Dispatch<React.SetStateAction<Customer | Employee | null>>
	fetchUser: () => Promise<Customer | Employee | null>
}

export const GlobalContext = React.createContext<IGlobalContext | null>(null)

export const useGlobal = () => {
	const context = React.useContext(GlobalContext)
	if (!context) {
		throw new Error('useGlobal must be used within a GlobalContext provider')
	}
	return context
}

export default GlobalContext