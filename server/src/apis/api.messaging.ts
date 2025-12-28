import { Router } from 'express'

import { apiResponse } from '../lib/apiResponse'
import { sendEmail, validateEmail, validateMessage, validateName } from '../service/email'

const router = Router()

router.post('/send-email', async (req, res) => {
	const code = 'SEND_EMAIL'

	// Validate inputs.
	const nameValidation = validateName(req.body.name as string)
	if (!nameValidation.passed) {
		return res.json(nameValidation)
	}
	const clientName = (nameValidation.data as { name: string }).name || ''

	const emailValidation = validateEmail(req.body.email as string)
	if (!emailValidation.passed) {
		return res.json(emailValidation)
	}
	const clientEmail = (emailValidation.data as { email: string }).email || ''

	const messageValidation = validateMessage(req.body.message as string)
	if (!messageValidation.passed) {
		return res.json(messageValidation)
	}
	const bodyMessage = (messageValidation.data as { message: string }).message || ''

	// Send an email to the info address.
	const subject = `New message from ${clientName}`
	const message = `You have received a new message from ${clientName} (${clientEmail}):\n\n${bodyMessage}`

	const result = await sendEmail(
		clientName,
		clientEmail,
		subject,
		message,
		'self'
	)
	if (!result.passed) return res.json(result)

	// Respond to the client.
	const confSubject = 'Thank you for contacting Harmony Health & Beauty'
	const confBody = [
		'Dear ' + clientName + ',',
		'',
		
		'Thank you for reaching out to us at Harmony Health & Beauty. We have received your message and will get back to you as soon as possible.',
		'',
		'Best regards,',
		'Harmony Health & Beauty Team',
		'','','----------------------------------------','',
		'Message Summary:',
		bodyMessage,
		'','----------------------------------------','',
		'This is an automated confirmation that we have received your message.',
	].join('\n')
	
	const confResult = await sendEmail(
		clientName,
		clientEmail,
		confSubject,
		confBody,
		'client'
	)
	if (!confResult.passed) return res.json(confResult)


	// Return success response.
	res.json(apiResponse(200, code, true, 'Message sent successfully'))
})

export default router
