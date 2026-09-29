import { useEffect, useMemo, useState } from 'react'

import Icon from '../icon/icon.component'
import { formatRelativeDate, isOpened } from '../../store/info'

import './hours.styles.scss'

function HoursDisplay() {
	const [opened, setOpened] = useState(false)
	const [until, setUntil] = useState<string | null>(null)

	const updateOpenedState = () => {
		const now = new Date()
		const { opened, until } = isOpened(now)

		console.log('HoursDisplay:', { now, opened, until, formattedUntil: until ? new Date(until).toString() : null })

		setOpened(opened)
		setUntil(until ? new Date(until).toISOString() : null)

		if (!until) return

		// Schedule a timeout to update the opened state when the next opening time arrives.
		const untilDate = new Date(until)
		const duration = untilDate.getTime() - now.getTime()

		const MAX_TIMEOUT = 2_147_483_647
		const timeoutDuration = Math.min(duration, MAX_TIMEOUT)
		return setTimeout(() => updateOpenedState(), timeoutDuration)
	}

	useEffect(() => {
		const timeout = updateOpenedState()

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [])

	const formattedUntil = useMemo(() => (until ? formatRelativeDate(new Date(until)) : null), [opened, until])

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
