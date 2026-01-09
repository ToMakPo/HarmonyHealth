import { useState, useMemo, type FormEvent } from 'react'

import { api } from '../../lib/api'
import type { ApiResponse } from '../../lib/apiResponse'

import './footer.style.sass'

/** Static contact information and socials for the company. */
const CONTACT = {
	phone: '(253) 797-8029',
	email: 'info@harmonyhealth.beauty',
	address: '9327 4th St NE, Suite 6,\nLake Stevens, WA 98258',
	socials: {
		instagram: 'HarmonyHealthAndBeauty'
	}
}

/** The application footer displaying useful links and contact information as well as a contact form. */
const AppFooter: React.FC = () => {
	/** == Footer Outro Section ==
	 * 
	 * Displays a brief message to the customers and provides links to social media.
	 */
	const footerOutroEl = useMemo(() => (
		<div id='footer-outro-section' className='clamp-width'>
			<p>From beauty insights to VIP promotions, get everything you need to elevate your skincare routine—straight from the experts
				at Harmony Health and Beauty.</p>

			<strong>Follow Us On Instagram
				<a
					href={`https://www.instagram.com/${CONTACT.socials.instagram.toLowerCase()}/`}
					target='_blank'
					rel='noopener'
				>@{CONTACT.socials.instagram}</a>.</strong>
		</div>
	), [])

	/** == Contact Information Section == 
	 * 
	 * Displays the company's contact information.
	 */
	const contactInfoEl = useMemo(() => (
		<div id='contact-info-section' className='clamp-width'>
			<h3>Contact Us</h3>
			<p>Phone: <a href={`tel:+1${CONTACT.phone.replace(/\D/g, '')}`}>{CONTACT.phone}</a></p>
			<p>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
		</div>
	), [])

	/** Provides the result of sending a message via the contact form.
	 * 
	 * If no message has been sent yet, this will be `null`.
	 * If the user attempted to send a message, this will contain whether the attempt passed and an associated message.
	 */
	const [sendMessageResult, updateSendMessageResult] = useState<{ passed: boolean, message: string } | null>(null)

	/** == Contact Form Section ==
	 * 
	 * A form allowing users to send messages to the company.
	 */
	const contactFormEl = useMemo(() => {
		function handleSentMessage(event: FormEvent<HTMLFormElement>): void {
			event.preventDefault()

			const form = event.currentTarget
			const name = (form.elements.namedItem('name') as HTMLInputElement).value
			const email = (form.elements.namedItem('email') as HTMLInputElement).value
			const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

			api.post('/messaging/send-email', { name, email, message }).then((res: ApiResponse) => {
				if (res.passed) {
					updateSendMessageResult({ passed: true, message: 'Message sent successfully' })

					form.reset()
				} else {
					updateSendMessageResult({ passed: false, message: res.message })
					console.error([
						'Failed to send message:',
						'Code: ' + res.code + '--' + res.sender,
						'Message: ' + res.message,
						'Data: ' + JSON.stringify(res.data),
						'Field: ' + res.focus
					].join('\n'))

					const errorField = res.focus

					if (errorField) {
						const fieldElement = form.elements.namedItem(errorField) as HTMLElement
						if (fieldElement) {
							fieldElement.focus()

						}
					}
				}
			}).catch((error) => {
				console.error('Error sending message:', error)
			})
		}

		return (
			<form id='contact-form-section'
				className='clamp-width'
				onSubmit={handleSentMessage}
			>
				<h3>Send Us a Message</h3>

				<div id='sender-info'>
					<div className='field-group'>
						<label htmlFor='name'>Name:</label>
						<input type='text' id='name' name='name' required autoComplete='name' />
					</div>

					<div className='field-group'>
						<label htmlFor='email'>Email:</label>
						<input type='email' id='email' name='email' required autoComplete='email' />
					</div>
				</div>

				<div className='field-group'>
					<label htmlFor='message'>Message:</label>
					<textarea id='message' name='message' rows={8} required></textarea>
				</div>

				<button type='submit' className='button primary'>Send Message</button>

				{sendMessageResult && (
					<div id='message-response' className={(sendMessageResult.passed ? 'success' : 'error')}>{sendMessageResult.message}</div>
				)}
			</form>
		)
	}, [sendMessageResult])

	/** == Map Section == 
	 * 
	 * Displays an embedded Google Map of the company's location.
	 */
	const mapEl = <div id='map-section' className='clamp-width'>
		<iframe
			id='map'
			src={`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
			style={{ border: '0' }}
			allowFullScreen
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade">
		</iframe>
		<address>{CONTACT.address}</address>
	</div>

	return (
		<footer id="app-footer">
			{footerOutroEl}
			{contactInfoEl}
			{contactFormEl}
			{mapEl}
		</footer>
	)
}

export default AppFooter