import { forwardRef, useRef, useState } from "react"
import Modal, { type ModalRef } from "../../components/modal/component.modal"
import Customer from "../../models/Customer"
import { getServerUrl } from "../../lib/utils"
import { useGlobal } from "../../app/global-context"

export interface CustomerRegisterModalProps {
	id?: string | undefined

	open?: boolean
	onClose?: () => void
	onRegister?: (user: Customer) => void

	setShowLogin: (show: boolean) => void
}

const CustomerRegisterModal = forwardRef<ModalRef, CustomerRegisterModalProps>((props, ref) => {
	const modalRef = ref as React.RefObject<ModalRef | null>

	const global = useGlobal()

	const usernameInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const passConfInputRef = useRef<HTMLInputElement>(null)
	const firstNameInputRef = useRef<HTMLInputElement>(null)
	const lastNameInputRef = useRef<HTMLInputElement>(null)
	const titleInputRef = useRef<HTMLInputElement>(null)
	const emailInputRef = useRef<HTMLInputElement>(null)
	const phoneInputRef = useRef<HTMLInputElement>(null)

	const [error, setError] = useState<string | null>(null)

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault()

		const values = {
			username: usernameInputRef.current?.value.trim() || '',
			password: passwordInputRef.current?.value.trim() || '',
			passConf: passConfInputRef.current?.value.trim() || '',
			firstName: firstNameInputRef.current?.value.trim() || '',
			lastName: lastNameInputRef.current?.value.trim() || '',
			title: titleInputRef.current?.value.trim() || '',
			email: emailInputRef.current?.value.trim() || '',
			phone: phoneInputRef.current?.value.trim() || ''
		}

		const response = await fetch(getServerUrl() + `/api/customer/register`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values })
		}).then(res => res.json()).catch(() => ({ success: false, message: 'Network error' }))

		if (!response.passed) {
			switch (response.focus) {
				case 'username':
					usernameInputRef.current?.focus()
					break
				case 'password':
					passwordInputRef.current?.focus()
					break
				case 'passConf':
					passConfInputRef.current?.focus()
					break
				case 'firstName':
					firstNameInputRef.current?.focus()
					break
				case 'lastName':
					lastNameInputRef.current?.focus()
					break
				case 'title':
					titleInputRef.current?.focus()
					break
				case 'email':
					emailInputRef.current?.focus()
					break
				case 'phone':
					phoneInputRef.current?.focus()
					break
			}
			setError(response.message)
			return
		}
		setError(null)

		const user = new Customer(response.data)
		global.setActiveUser(user)

		if (props.onRegister) props.onRegister(user)
		if (modalRef.current) modalRef.current.close()
	}

	return (
		<Modal id={props.id} ref={modalRef} open={props.open} onClose={props.onClose} header="Register" className={`customer-register-modal`}>
			<form className="register-form" onSubmit={handleRegister}>
				<div className="input-row">
					<div className="field-group">
						<label htmlFor="username-input">Username</label>
						<input type="text" id="username-input" ref={usernameInputRef} autoComplete="username" required />
					</div>

					<div className="field-group">
						<label htmlFor="email-input">Email</label>
						<input type="email" id="email-input" ref={emailInputRef} autoComplete="email" required />
					</div>
				</div>

				<div className="input-row">
					<div className="field-group">
						<label htmlFor="password-input">Password</label>
						<input type="password" id="password-input" ref={passwordInputRef} autoComplete="new-password" required />
					</div>

					<div className="field-group">
						<label htmlFor="passconf-input">Confirm Password</label>
						<input type="password" id="passconf-input" ref={passConfInputRef} autoComplete="new-password" required />
					</div>
				</div>

				<div className="input-row">
					<div className="field-group" style={{ flex: '0' }}>
						<label htmlFor="title-input">Title</label>
						<input type="text" id="title-input" ref={titleInputRef} list="title-options" style={{ 
							width: '6ch'
						}} />
						<datalist id="title-options">
							<option value="Mr." />
							<option value="Ms." />
							<option value="Mrs." />
							<option value="Miss" />
							<option value="Mx." />
							<option value="Dr." />
							<option value="Prof." />
							<option value="Rev." />
							<option value="Hon." />
							<option value="Sir" />
							<option value="Dame" />
						</datalist>
					</div>

					<div className="field-group">
						<label htmlFor="first-name-input">First Name</label>
						<input type="text" id="first-name-input" ref={firstNameInputRef} required />
					</div>

					<div className="field-group">
						<label htmlFor="last-name-input">Last Name</label>
						<input type="text" id="last-name-input" ref={lastNameInputRef} required />
					</div>
				</div>

				<div className="field-group">
					<label htmlFor="phone-input">Phone</label>
					<input type="tel" id="phone-input" ref={phoneInputRef} autoComplete="tel" required />
				</div>

				{error && <div className="error-message" role="alert">{error}</div>}

				<button type="submit">Register</button>

				<a href="#" onClick={() => {
					if (modalRef.current) modalRef.current.close()
					props.setShowLogin(true)
				}}>Already have an account? Login</a>
			</form>
		</Modal>
	)
})

export default CustomerRegisterModal