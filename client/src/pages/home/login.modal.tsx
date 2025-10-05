import { forwardRef, useRef, useState } from "react"
import Modal, { type ModalRef } from "../../components/modal/modal.component"
import Customer from "../../models/Customer"
import Employee from "../../models/Employee"
import { getServerUrl } from "../../lib/utils"
import { useGlobal } from "../../context"

export interface LoginModalProps {
	target: 'customer' | 'employee'

	open?: boolean
	onClose?: () => void
	onLogin?: (user: Customer | Employee) => void
}

const LoginModal = forwardRef<ModalRef, LoginModalProps>((props, ref) => {
	const modalRef = ref as React.RefObject<ModalRef | null>

	const global = useGlobal()

	const credentialsRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState<string | null>(null)

	const rememberMeRef = useRef<HTMLInputElement>(null)

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()

		const credentials = credentialsRef.current?.value.trim() || ''
		const password = passwordRef.current?.value.trim() || ''
		const rememberMe = rememberMeRef.current?.checked || false

		const response = await fetch(getServerUrl() + `/api/${props.target}/login`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ credentials, password, rememberMe })
		}).then(res => res.json()).catch(() => ({ success: false, message: 'Network error' }))

		if (!response.passed) {
			switch (response.focus) {
				case 'credentials':
					credentialsRef.current?.focus()
					break
				case 'password':
					passwordRef.current?.focus()
					break
			}
			setError(response.message)
			return
		}
		setError(null)

		const user = props.target === 'employee' ? new Employee(response.data) : new Customer(response.data)
		global.setActiveUser(user)

		if (props.onLogin) props.onLogin(user)
		if (modalRef.current) modalRef.current.close()
	}

	return (
		<Modal ref={modalRef} open={props.open} onClose={props.onClose} header="Login" className="login-modal">
			<form className="login-form" onSubmit={handleLogin}>
				<div className="form-group">
					<label htmlFor="credentials">Email or Username</label>
					<input type="text" id="credentials" ref={credentialsRef} required />
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input type="password" id="password" ref={passwordRef} required />
				</div>

				<div className="form-group">
					<label htmlFor="rememberMe">
						<input type="checkbox" id="rememberMe" ref={rememberMeRef} />
						Remember Me
					</label>
				</div>

				{error && <div className="error-message" role="alert">{error}</div>}

				<button type="submit">Login</button>
			</form>
		</Modal>
	)
})

export default LoginModal