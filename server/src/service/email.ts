import nodemailer from 'nodemailer'

import { apiResponse } from '../lib/apiResponse'

const mailer = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT) || 587,
	secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
})

const getAddress = (name: string, email: string) => `"${name}" <${email}>`

export const validateName = (value: string) => {
	const code = 'SEND_EMAIL_NAME_VALIDATION'
	const minLength = 2
	const maxLength = 100

	if (value == null) {
		return apiResponse(400, code, false, 'Name is required', {}, 'senderName')
	}

	// Format the value by trimming whitespace.
	const name = value.trim()

	// Check length constraints.
	if (name.length === 0) {
		return apiResponse(401, code, false, 'Name is required', {}, 'senderName')
	}

	if (name.length < minLength) {
		return apiResponse(402, code, false, 'Name is too short', { name, minLength }, 'senderName')
	}

	if (name.length > maxLength) {
		return apiResponse(403, code, false, 'Name is too long', { name, maxLength }, 'senderName')
	}

	// Name is valid.
	return apiResponse(200, code, true, 'Name is valid', { name }, 'senderName')
}

export const validateEmail = (value: string) => {
	const code = 'SEND_EMAIL_EMAIL_VALIDATION'
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (value == null) {
		return apiResponse(400, code, false, 'Email is required', {}, 'senderEmail')
	}

	// Format the value by trimming whitespace.
	const email = value.trim()

	// Check for presence and format.
	if (email.length === 0) {
		return apiResponse(401, code, false, 'Email is required', {}, 'senderEmail')
	}

	if (!emailRegex.test(email)) {
		return apiResponse(402, code, false, 'Invalid email format', { email }, 'senderEmail')
	}

	// Email is valid.
	return apiResponse(200, code, true, 'Email is valid', { email }, 'senderEmail')
}

export const validateMessage = (value: string) => {
	const code = 'SEND_EMAIL_BODY_VALIDATION'
	const minLength = 2
	const maxLength = 5000

	if (value == null) {
		return apiResponse(400, code, false, 'Message body is required', {}, 'messageBody')
	}

	// Format the value by trimming whitespace.
	const message = value.trim()

	// Check length constraints.
	if (message.length === 0) {
		return apiResponse(401, code, false, 'Message body is required', {}, 'messageBody')
	}

	if (message.length < minLength) {
		return apiResponse(402, code, false, 'Message body is too short', { message, minLength }, 'messageBody')
	}

	if (message.length > maxLength) {
		return apiResponse(403, code, false, 'Message body is too long', { message, maxLength }, 'messageBody')
	}

	// Message body is valid.
	return apiResponse(200, code, true, 'Message body is valid', { message }, 'messageBody')
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
export const sendEmail = async (
	clientName: string,
	clientEmail: string,
	subject: string,
	body: string,
	sendTo?: 'self' | 'client',
) => {
	const code = 'SENDING_EMAIL'

	const clientAddress = getAddress(clientName, clientEmail)
	const sendToAddress = sendTo === 'self' ? infoAddress : clientAddress

	const result = await mailer.sendMail({ 
		from: senderEmail,
		to: sendToAddress,
		replyTo: sendTo === 'self' ? clientAddress : infoAddress,
		subject,
		text: body,
	})

	console.log('Email send result:', result)

	if (result.rejected.length > 0) {
		return apiResponse(400, code, false, 'Failed to send email', { result, clientName, clientEmail, subject, body, sendTo })
	}
	return apiResponse(200, code, true, 'Email sent successfully', { result, clientName, clientEmail, subject, body, sendTo })
}