import { useState } from "react"

import { GlobalContext } from "./global.context"

interface GlobalProviderProps {
	children: React.ReactNode
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
	const [activeUser, setActiveUser] = useState<null>(null)

	return (
		<GlobalContext.Provider value={{ activeUser, setActiveUser }}>
			{children}
		</GlobalContext.Provider>
	)
}

export default GlobalProvider