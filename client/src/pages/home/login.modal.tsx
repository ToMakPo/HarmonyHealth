import { forwardRef, useRef, useState } from "react"
import Modal, { type ModalRef } from "../../components/modal/modal.component"
import Customer from "../../models/Customer"
import Employee from "../../models/Employee"
import { getServerUrl } from "../../lib/utils"
import { useGlobal } from "../../context"

export interface LoginModalProps {
	id?: string | undefined
	target: 'customer' | 'employee'

	open?: boolean
	onClose?: () => void
	onLogin?: (user: Customer | Employee) => void
}

const LoginModal = forwardRef<ModalRef, LoginModalProps>((props, ref) => {
	const modalRef = ref as React.RefObject<ModalRef | null>

	const global = useGlobal()

	const credentialsInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState<string | null>(null)

	const rememberMeCheckboxRef = useRef<HTMLInputElement>(null)

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()

		const credentials = credentialsInputRef.current?.value.trim() || ''
		const password = passwordInputRef.current?.value.trim() || ''
		const rememberMe = rememberMeCheckboxRef.current?.checked || false

		const response = await fetch(getServerUrl() + `/api/${props.target}/login`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ credentials, password, rememberMe })
		}).then(res => res.json()).catch(() => ({ success: false, message: 'Network error' }))

		if (!response.passed) {
			switch (response.focus) {
				case 'credentials':
					credentialsInputRef.current?.focus()
					break
				case 'password':
					passwordInputRef.current?.focus()
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
		<Modal id={props.id} ref={modalRef} open={props.open} onClose={props.onClose} header="Login" className={["login-modal", `${props.target}-login-modal`]}>
			<form className="login-form" onSubmit={handleLogin}>
				<div className="field-group">
					<label htmlFor="credentials-input">Username or Email</label>
					<input type="text" id="credentials-input" ref={credentialsInputRef} autoComplete="username" required />
				</div>

				<div className="field-group">
					<label htmlFor="password-input">Password</label>
					<input type="password" id="password-input" ref={passwordInputRef} autoComplete="current-password" required />
				</div>

				<div className="click-group">
					<label htmlFor="remember-me-checkbox">Remember Me</label>
					<input type="checkbox" id="remember-me-checkbox" ref={rememberMeCheckboxRef} />
				</div>

				{error && <div className="error-message" role="alert">{error}</div>}

				<button type="submit">Login</button>
			</form>
		</Modal>
	)
})

export default LoginModal