import React, { useContext } from 'react'

import Customer from '../../models/Customer'

interface IGlobalContext {
	/** The currently active user in the application. */
	activeUser: Customer | null
	/** Function to update the active user. */
	setActiveUser: React.Dispatch<React.SetStateAction<Customer | null>>
}

export const GlobalContext = React.createContext<IGlobalContext | null>(null)


/** Global variables that can be accessed throughout the application. */
const useGlobal = () => {
	const context = useContext(GlobalContext)
	
	if (!context) {
		throw new Error('useGlobal must be used within a GlobalContext provider')
	}
	return context
}

export default useGlobal