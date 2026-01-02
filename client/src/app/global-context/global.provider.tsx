import { useState } from "react"

import { GlobalContext } from "./global.context"
import type Customer from "../../models/Customer"

interface GlobalProviderProps {
	children: React.ReactNode
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
	const [activeUser, setActiveUser] = useState<Customer | null>(null)

	return (
		<GlobalContext.Provider value={{ activeUser, setActiveUser }}>
			{children}
		</GlobalContext.Provider>
	)
}

export default GlobalProvider