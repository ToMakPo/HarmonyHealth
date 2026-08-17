import nodemailer from 'nodemailer'

import { apiResponse } from '../lib/apiResponse'

if (!process.env.SMTP_HOST) {
	throw new Error('CRITICAL: SMTP_HOST environment variable is missing or dotenv is not initialized early enough.')
}

console.log('SMTP configuration:', {
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: process.env.SMTP_SECURE,
	user: process.env.SMTP_USER,
	passwordSet: Boolean(process.env.SMTP_PASS),
	infoEmail: process.env.INFO_EMAIL
})

const mailer = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: true,
	auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
})

mailer.verify((error, success) => {
	if (error) {
		console.error('SMTP CONNECTION FAILED:', error)
	} else {
		console.log('SMTP CONNECTION SUCCESSFUL')
	}
})

const getAddress = (name: string, email: string) => `"${name}" <${email}>`

export const validateName = (value: string) => {
	const sender = 'SEND_EMAIL_NAME_VALIDATION'
	const minLength = 2
	const maxLength = 100

	if (value == null) {
		return apiResponse(false, sender, 400, 'Name is required', {}, 'senderName')
	}

	// Format the value by trimming whitespace.
	const name = value.trim()

	// Check length constraints.
	if (name.length === 0) {
		return apiResponse(false, sender, 401, 'Name is required', {}, 'senderName')
	}

	if (name.length < minLength) {
		return apiResponse(false, sender, 402, 'Name is too short', { name, minLength }, 'senderName')
	}

	if (name.length > maxLength) {
		return apiResponse(false, sender, 403, 'Name is too long', { name, maxLength }, 'senderName')
	}

	// Name is valid.
	return apiResponse(true, sender, 200, 'Name is valid', { name }, 'senderName')
}

export const validateEmail = (value: string) => {
	const sender = 'SEND_EMAIL_EMAIL_VALIDATION'
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (value == null) {
		return apiResponse(false, sender, 400, 'Email is required', {}, 'senderEmail')
	}

	// Format the value by trimming whitespace.
	const email = value.trim()

	// Check for presence and format.
	if (email.length === 0) {
		return apiResponse(false, sender, 401, 'Email is required', {}, 'senderEmail')
	}

	if (!emailRegex.test(email)) {
		return apiResponse(false, sender, 402, 'Invalid email format', { email }, 'senderEmail')
	}

	// Email is valid.
	return apiResponse(true, sender, 200, 'Email is valid', { email }, 'senderEmail')
}

export const validateSubject = (value: string) => {
	const sender = 'SEND_EMAIL_SUBJECT_VALIDATION'
	const minLength = 0
	const maxLength = 200

	if (value == null) {
		return apiResponse(false, sender, 400, 'Subject is required', {}, 'subject')
	}

	// Format the value by trimming whitespace.
	const subject = value.trim()

	// Check length constraints.
	if (subject.length === 0) {
		return apiResponse(false, sender, 401, 'Subject is required', {}, 'subject')
	}

	if (subject.length < minLength) {
		return apiResponse(false, sender, 402, 'Subject is too short', { subject, minLength }, 'subject')
	}

	if (subject.length > maxLength) {
		return apiResponse(false, sender, 403, 'Subject is too long', { subject, maxLength }, 'subject')
	}

	// Subject is valid.
	return apiResponse(true, sender, 200, 'Subject is valid', { subject }, 'subject')
}

export const validateMessage = (value: string) => {
	const sender = 'SEND_EMAIL_BODY_VALIDATION'
	const minLength = 2
	const maxLength = 5000

	if (value == null) {
		return apiResponse(false, sender, 400, 'Message body is required', {}, 'messageBody')
	}

	// Format the value by trimming whitespace.
	const message = value.trim()

	// Check length constraints.
	if (message.length === 0) {
		return apiResponse(false, sender, 401, 'Message body is required', {}, 'messageBody')
	}

	if (message.length < minLength) {
		return apiResponse(false, sender, 402, 'Message body is too short', { message, minLength }, 'messageBody')
	}

	if (message.length > maxLength) {
		return apiResponse(false, sender, 403, 'Message body is too long', { message, maxLength }, 'messageBody')
	}

	// Message body is valid.
	return apiResponse(true, sender, 200, 'Message body is valid', { message }, 'messageBody')
}

const senderEmail = (() => {
	const senderVR = validateEmail(process.env.SENDER_EMAIL as string)
	if (senderVR.passed) return (senderVR.data as { email: string }).email

	const smtpVR = validateEmail(process.env.SMTP_USER as string)
	if (smtpVR.passed) return (smtpVR.data as { email: string }).email

	throw new Error('No valid sender email configured in SENDER_EMAIL or SMTP_USER environment variables')
})()
const infoName = (() => {
	const nameVR = validateName(process.env.INFO_NAME as string)
	if (nameVR.passed) return (nameVR.data as { name: string }).name

	return 'Info'
})()
const infoEmail = (() => {
	const infoVR = validateEmail(process.env.INFO_EMAIL as string)
	if (infoVR.passed) return (infoVR.data as { email: string }).email
	return senderEmail
})()
const infoAddress = getAddress(infoName, infoEmail)

/** Send an email either to the info address or to the client.
 *
 * @param clientName The name of the client.
 * @param clientEmail The email address of the client.
 * @param subject The subject line of the email.
 * @param body The body content of the email.
 * @param sendTo `self` to send to the info address, `client` to send to the client address.
 */
export const sendEmail = async (clientName: string, clientEmail: string, subject: string, body: string, sendTo?: 'self' | 'client') => {
	const sender = 'SENDING_EMAIL'

	const clientAddress = getAddress(clientName, clientEmail)
	const sendToAddress = sendTo === 'self' ? infoAddress : clientAddress

	try {
		const result = await mailer.sendMail({
			from: senderEmail,
			to: sendToAddress,
			replyTo: sendTo === 'self' ? clientAddress : infoAddress,
			subject,
			text: body
		})

		console.info('Email send result:', result)

		if (result.rejected.length > 0) {
			return apiResponse(false, sender, 400, 'Failed to send email', { result, clientName, clientEmail, subject, body, sendTo })
		}
		return apiResponse(true, sender, 200, 'Email sent successfully', { result, clientName, clientEmail, subject, body, sendTo })
	} catch (error) {
		console.error('Error sending email:', error)

		return apiResponse(false, sender, 500, 'An error occurred while sending email', {
			error: error instanceof Error ? error.message : String(error)
		})
	}
}
