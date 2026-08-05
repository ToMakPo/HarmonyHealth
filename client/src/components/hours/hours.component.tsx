import { useEffect, useMemo, useState } from 'react'

import Icon from '../icon/icon.component'
import { formatRelativeDate, isOpened } from '../../store/info'

import './hours.styles.scss'

function HoursDisplay() {
	const [opened, setOpened] = useState(false)
	const [until, setUntil] = useState<string | null>(null)

	const updateOpenedState = (date?: string | null) => {
		const now = date ? new Date(date) : new Date()
		const { opened, until } = isOpened(now)
		setOpened(opened)
		setUntil(until ? new Date(until).toISOString() : null)
		console.log({ now, opened, until })

		if (!until) return

		// Schedule a timeout to update the opened state when the next opening time arrives.
		const untilDate = new Date(until)
		const duration = untilDate.getTime() - now.getTime()
		const timeout = setTimeout(() => updateOpenedState(until ? untilDate.toISOString() : null), duration)
		return () => clearTimeout(timeout)
	}

	useEffect(() => {
		updateOpenedState()
	}, [])

	const formattedUntil = useMemo(() => (until ? formatRelativeDate(new Date(until)) : null), [opened, until])

	useEffect(() => {
		console.log({ opened })
		console.log({ until })
	}, [opened, until])

	return (
		<div id='hours-display'>
			{opened ? (
				<>
					<span className='status-icon opened-icon'>
						<Icon name='storefront' className='normal' size='28px' />
					</span>
					We are currently opened until {formattedUntil}
				</>
			) : (
				<>
					<span className='status-icon closed-icon'>
						<Icon name='bedtime' className='normal' size='28px' />
						<Icon name='moon_stars' className='hovered' size='28px' />
					</span>
					We are currently closed until {formattedUntil}
				</>
			)}
		</div>
	)
}

export default HoursDisplay
