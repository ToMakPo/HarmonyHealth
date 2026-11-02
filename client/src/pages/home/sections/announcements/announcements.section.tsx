import { marked } from 'marked'
import stripIndent from 'strip-indent'

import './announcements.styles.scss'

function AnnouncementSection() {
	const startDate = new Date('2024-01-01')
	const endDate = new Date('2024-12-31')
	const currentDate = new Date()
	const isWithinAnnouncementPeriod = currentDate >= startDate && currentDate <= endDate
	const markdownString = `
		## Important Announcement
		Stay tuned for upcoming events and updates from Harmony Health Wellness Center.
	`
	const cleanedMarkdownString = marked.parse(stripIndent(markdownString))

	return (
		isWithinAnnouncementPeriod && (
			<section id='announcements-section'>
				<div id='announcements-container' className='container' dangerouslySetInnerHTML={{ __html: cleanedMarkdownString }}></div>
			</section>
		)
	)
}

export default AnnouncementSection
