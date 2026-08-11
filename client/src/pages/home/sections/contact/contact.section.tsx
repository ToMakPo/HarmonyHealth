import { useEffect, useState } from 'react'

import { companyInfo } from '../../../../store/info'
import HoursDisplay from '../../../../components/hours/hours.component'

import './contact.styles.scss'
import type { ApiResponse } from '../../../../lib/apiResponse'

type SendStatus = 'sending' | 'success' | 'failure' | null

function ContactSection() {
	const [sendStatus, setSendStatus] = useState<SendStatus>(null)

	useEffect(() => {
		const form = document.getElementById('contact-form') as HTMLFormElement
		const submitButton = form.querySelector('[type="submit"]') as HTMLButtonElement
		submitButton.disabled = sendStatus === 'sending'
	}, [sendStatus])

	async function submitEmail(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setSendStatus('sending')

		const formData = new FormData(e.currentTarget)
		const formElement = e.currentTarget as HTMLFormElement
		const serverUrl = import.meta.env.VITE_SERVER_URL

		const response = await fetch(`${serverUrl}/api/messaging/send-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(formData.entries()))
		})

		const contentType = response.headers.get('Content-Type') ?? ''

		if (!contentType.includes('application/json')) {
			const text = await response.text()

			throw new Error(`Server returned ${response.status}: ${text}`)
		}

		const data: ApiResponse = await response.json()

		if (data.passed) {
			setSendStatus('success')
			console.info('Email sent successfully!')
			formElement.reset()
		} else {
			setSendStatus('failure')
			console.error('Failed to send email.')
		}
	}

	useEffect(() => {
		if (sendStatus === 'success' || sendStatus === 'failure') {
			const timer = setTimeout(() => setSendStatus(null), 5000)
			return () => clearTimeout(timer)
		}
	}, [sendStatus])

	const contactForm = (
		<form id='contact-form' onSubmit={submitEmail}>
			<div className='input-row'>
				<div className='input-group'>
					<label htmlFor='name'>Name</label>
					<input id='name' name='name' type='text' autoComplete='name' required />
				</div>
				<div className='input-group'>
					<label htmlFor='email'>Email</label>
					<input id='email' name='email' type='email' autoComplete='email' required />
				</div>
			</div>
			<div className='input-group'>
				<label htmlFor='subject'>Subject</label>
				<input id='subject' name='subject' type='text' autoComplete='off' />
			</div>
			<div className='input-group'>
				<label htmlFor='message'>Message</label>
				<textarea id='message' name='message' autoComplete='off' required></textarea>
			</div>

			<input type='submit' disabled={sendStatus === 'sending'} value={sendStatus === 'sending' ? 'Sending...' : 'Send'} />

			<span className={'send-response ' + sendStatus}>
				{sendStatus === 'success'
					? 'Message sent successfully!'
					: sendStatus === 'failure'
						? 'Failed to send message. Please try again later.'
						: ''}
			</span>
		</form>
	)

	const contactInfo = (
		<div className='contact-info'>
			<p>
				Email: <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
			</p>
			<p>
				Phone: <a href={`tel:1${companyInfo.phone.replace(/\D/g, '')}`}>{companyInfo.phone}</a>
			</p>
		</div>
	)

	const hours = (
		<div className='contact-hours'>
			<h2>Hours</h2>

			<table>
				<tbody>
					{Object.entries(companyInfo.hours).map(([day, periods]) =>
						periods.length > 0 ? (
							<tr key={day}>
								<td style={{ paddingRight: '1rem' }}>{day}</td>
								<td>{periods.map(period => `${period.open} - ${period.closed}`).join(', ')}</td>
							</tr>
						) : null
					)}
				</tbody>
			</table>
		</div>
	)

	return (
		<section id='contact-section'>
			<h1>Contact Us</h1>
			<div id='contact-container'>
				{contactForm}
				<div>
					{contactInfo}
					{hours}
				</div>
			</div>
			<HoursDisplay />
		</section>
	)
}

export default ContactSection
