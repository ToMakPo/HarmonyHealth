import { useState } from "react"
import LoginModal from "./login.modal"

const HomePage: React.FC = () => {
	const [showCustomerLogin, setShowCustomerLogin] = useState(false)
	const [showEmployeeLogin, setShowEmployeeLogin] = useState(false)

	return <>
		<div>
			<h1>Welcome to Harmony Health</h1>
			<p>Your journey to better health starts here.</p>

			<div className="button-group">
				<button type="button" onClick={() => setShowCustomerLogin(true)}>Customer Login</button>
				<button type="button" onClick={() => setShowEmployeeLogin(true)}>Employee Login</button>
			</div>
		</div>

		<LoginModal target="customer" open={showCustomerLogin} onClose={() => setShowCustomerLogin(false)} />
		<LoginModal target="employee" open={showEmployeeLogin} onClose={() => setShowEmployeeLogin(false)} />
	</>
}

export default HomePage