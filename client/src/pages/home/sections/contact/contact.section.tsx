import { useEffect, useState } from 'react'

import { companyInfo } from '../../../../store/info'
import HoursDisplay from '../../../../components/hours/hours.component'

import './contact.styles.scss'

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

		const serverUrl = import.meta.env.VITE_SERVER_URL

		const data = await fetch(`${serverUrl}/api/messaging/send-email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(formData.entries()))
		}).then(res => res.json())

		// console.log(data)

		// const response = await fetch('https://web3forms.com', { method: 'POST', body: formData }).then(res => res.json())

		if (data.success) {
			setSendStatus('success')
			// 	e.currentTarget.reset()
			console.info('Email sent successfully!')
		} else {
			setSendStatus('failure')
			console.error('Failed to send email.')
		}

		// setEmailResponse(null)
	}

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

			{sendStatus && (
				<span className={'send-response ' + sendStatus}>
					{sendStatus === 'success'
						? 'Message sent successfully!'
						: sendStatus === 'failure'
							? 'Failed to send message. Please try again later.'
							: ''}
				</span>
			)}
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

			<ul>
				{Object.entries(companyInfo.hours).map(
					([day, periods]) =>
						periods.length > 0 && (
							<li key={day}>
								{day}: {periods.map(period => `${period.open} - ${period.closed}`).join(', ')}
							</li>
						)
				)}
			</ul>
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
