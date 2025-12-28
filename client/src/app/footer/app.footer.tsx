import { useState, useRef, type FormEvent } from 'react'

import './style.footer.sass'
import { api } from '../../lib/api'
import type { ApiResponse } from '../../lib/apiResponse'

const AppFooter = () => {
	const instagramLink = <a
		href='https://www.instagram.com/harmonyhealthandbeautyclinic/'
		target='_blank'
		rel='noopener'
	>@harmonyhealthandbeautyclinic</a>

	const outroEl = (
		<div id='footer-outro' className='clamp-width'>
			<p>From beauty insights to VIP promotions, get everything you need to elevate your skincare routine—straight from the experts
				at Harmony Health and Beauty.</p>

			<strong>Follow Us On Instagram {instagramLink}.</strong>
		</div>
	)

	const [sendMessage, setSendMessage] = useState<{ passed: boolean, message: string } | null>(null)
	const formRef = useRef<HTMLFormElement>(null)

	function handleSentMessage(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault()

		const form = event.currentTarget
		const name = (form.elements.namedItem('name') as HTMLInputElement).value
		const email = (form.elements.namedItem('email') as HTMLInputElement).value
		const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

		console.log('Sending message:', { name, email, message })

		api.post('/messaging/send-email', { name, email, message }).then((res: ApiResponse) => {
			if (res.passed) {
				setSendMessage({ passed: true, message: 'Message sent successfully' })

				// reset form
				if (formRef.current) {
					// formRef.current.reset()
				}
			} else {
				setSendMessage({ passed: false, message: res.message })
				console.error([
					'Failed to send message:',
					'Code: ' + res.code + '--' + res.id,
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

	const phoneNumber = '(253) 797-8029'
	const emailAddress = 'info@harmonyhealth.beauty'
	
	const contactInfoEl = (
		<div id='contact-info'
			className='clamp-width'
		>
			<h3>Contact Us</h3>
			<p>Phone: <a href={`tel:+1${phoneNumber.replace(/\D/g, '')}`}>{phoneNumber}</a></p>
			<p>Email: <a href={`mailto:${emailAddress}`}>{emailAddress}</a></p>
		</div>
	)

	const contactUsEl = (
		<form id='contact-form'
			className='clamp-width'
			ref={formRef}
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

			{sendMessage && (
				<div id='message-response' className={(sendMessage.passed ? 'success' : 'error')}>{sendMessage.message}</div>
			)}
		</form>
	)

	const mapEl = <div id='map-container' className='clamp-width'>
		<iframe
			id='map'
			src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2288.168532455968!2d-122.10798127688895!3d47.99979198419464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1766867743817!5m2!1sen!2sus"
			style={{ border: '0' }}
			allowFullScreen
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade">
		</iframe>
		<address>9327 4th St NE, Suite 6, Lake Stevens, WA 98258</address>
	</div>

	return (
		<footer id="app-footer">
			{outroEl}
			{contactInfoEl}
			{contactUsEl}
			{mapEl}
		</footer>
	)
}

export default AppFooter