import React from 'react'
import Customer from '../models/Customer'

export interface IGlobalContext {
	activeUser: Customer | null
	setActiveUser: React.Dispatch<React.SetStateAction<Customer | null>>
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