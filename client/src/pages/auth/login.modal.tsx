import { forwardRef, useRef, useState } from "react"
import Modal, { type ModalRef } from "../../components/modal/modal.component"
import Customer from "../../models/Customer"
import { getServerUrl } from "../../lib/utils"
import useGlobal from "../../app/global-context/global.context"

export interface CustomerLoginModalProps {
	id?: string | undefined

	open?: boolean
	onClose?: () => void
	onLogin?: (user: Customer) => void

	setShowRegister: (show: boolean) => void
}

const CustomerLoginModal = forwardRef<ModalRef, CustomerLoginModalProps>((props, ref) => {
	const modalRef = ref as React.RefObject<ModalRef | null>

	const global = useGlobal()

	const credentialsInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const rememberMeCheckboxRef = useRef<HTMLInputElement>(null)

	const [error, setError] = useState<string | null>(null)

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()

		const values = {
			credentials: credentialsInputRef.current?.value.trim() || '',
			password: passwordInputRef.current?.value.trim() || '',
			rememberMe: rememberMeCheckboxRef.current?.checked || false
		}

		const response = await fetch(getServerUrl() + `/api/customer/login`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values })
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

		const user = new Customer(response.data)
		global.setActiveUser(user)

		if (props.onLogin) props.onLogin(user)
		if (modalRef.current) modalRef.current.close()
	}

	return (
		<Modal id={props.id} ref={modalRef} open={props.open} onClose={props.onClose} header="Login" className={`customer-login-modal`}>
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

			<a href="#" onClick={() => {
				if (modalRef.current) modalRef.current.close()
				props.setShowRegister(true)
			}}>Don't have an account? Register</a>
		</Modal>
	)
})

export default CustomerLoginModal