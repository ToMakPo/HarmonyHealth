export interface TimePeriod {
	open: string // "HH:MM"
	closed: string // "HH:MM"
}

export interface Event {
	event: string
	from: string
	to: string
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
type DayOfWeek = (typeof DAYS_OF_WEEK)[number]

export const companyInfo = {
	name: 'Harmony Health Wellness Center',
	address: ['2707 Bickford Ave, Suite B', 'Snohomish, WA 98290'],
	phone: '(360) 217-6020',
	email: 'info@harmonyhealthwellness.or`		g/',
	website: 'https://harmonyhealthwellness.org',
	hours: {
		Sunday: [],
		Monday: [{ open: '09:00', closed: '17:00' }],
		Tuesday: [{ open: '09:00', closed: '17:00' }],
		Wednesday: [{ open: '09:00', closed: '17:00' }],
		Thursday: [{ open: '09:00', closed: '17:00' }],
		Friday: [{ open: '09:00', closed: '17:00' }],
		Saturday: []
	} as Record<DayOfWeek, TimePeriod[]>,
	datesClosed: [{ event: 'Construction', from: '2026-07-01', to: '2026-09-30' }] as Event[]
}

type NextOpening = {
	opened: boolean
	until: string | null // Now always returns a full ISO 8601 String ("2026-07-26T22:00:00")
}

export function isOpened(date?: Date): NextOpening {
	const now = date ?? new Date()
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	})
	const parts = formatter.formatToParts(now)
	const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]))
	const localNow = new Date(`${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}`)
	const localTodayStr = `${partMap.year}-${partMap.month}-${partMap.day}`

	const isDateClosedStr = (dateStr: string): boolean => {
		const targetDate = new Date(dateStr + 'T00:00:00')
		return companyInfo.datesClosed.some(closure => {
			const from = new Date(closure.from + 'T00:00:00')
			const to = new Date(closure.to + 'T23:59:59')
			return targetDate >= from && targetDate <= to
		})
	}

	if (isDateClosedStr(localTodayStr)) {
		return getNextOpening(localNow, isDateClosedStr)
	}

	const currentDayName = DAYS_OF_WEEK[localNow.getDay()]
	const todayTimes = companyInfo.hours[currentDayName] || []
	const currentMinutes = localNow.getHours() * 60 + localNow.getMinutes()

	for (const period of todayTimes) {
		const [openH, openM] = period.open.split(':').map(Number)
		const [closeH, closeM] = period.closed.split(':').map(Number)
		const openMinutes = openH * 60 + openM
		const closeMinutes = closeH * 60 + closeM

		if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
			// Create a clean ISO string for closing time today
			const closeIso = `${localTodayStr}T${period.closed}:00`
			return { opened: true, until: closeIso }
		}
	}

	return getNextOpening(localNow, isDateClosedStr)
}

function getNextOpening(currentDate: Date, isDateClosedStr: (d: string) => boolean): NextOpening {
	let checkDate = new Date(currentDate.getTime())

	for (let i = 0; i < 365; i++) {
		const year = checkDate.getFullYear()
		const month = String(checkDate.getMonth() + 1).padStart(2, '0')
		const day = String(checkDate.getDate()).padStart(2, '0')
		const dateStr = `${year}-${month}-${day}`

		if (!isDateClosedStr(dateStr)) {
			const dayName = DAYS_OF_WEEK[checkDate.getDay()]
			const dayTimes = companyInfo.hours[dayName] || []
			const checkMinutes = i === 0 ? currentDate.getHours() * 60 + currentDate.getMinutes() : -1

			for (const period of dayTimes) {
				const [openH, openM] = period.open.split(':').map(Number)
				const openMinutes = openH * 60 + openM

				if (openMinutes > checkMinutes) {
					// Create a clean ISO string for the future opening timestamp
					const openIso = `${dateStr}T${period.open}:00`
					return { opened: false, until: openIso }
				}
			}
		}
		checkDate.setDate(checkDate.getDate() + 1)
		checkDate.setHours(0, 0, 0, 0)
	}

	return { opened: false, until: null }
}
interface FormatOptions {
	locale?: string
	timeOptions?: Intl.DateTimeFormatOptions
	dateOptions?: Intl.DateTimeFormatOptions
}

export function formatRelativeDate(targetDate: Date, referenceDate: Date = new Date(), options: FormatOptions = {}): string {
	const {
		locale = undefined,
		timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true },
		dateOptions = { weekday: 'long', year: undefined, month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }
	} = options

	const isSameDay =
		targetDate.getFullYear() === referenceDate.getFullYear()
		&& targetDate.getMonth() === referenceDate.getMonth()
		&& targetDate.getDate() === referenceDate.getDate()

	return isSameDay
		? new Intl.DateTimeFormat(locale, timeOptions).format(targetDate)
		: new Intl.DateTimeFormat(locale, dateOptions).format(targetDate)
}
