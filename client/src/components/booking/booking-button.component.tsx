import './booking-button.styles.scss'

declare global {
	interface Window {
		blvd?: { openBookingWidget: (options: Record<string, unknown>) => void }
	}
}

function BookingButton() {
	function handleBooking() {
		if (window.blvd && typeof window.blvd.openBookingWidget === 'function') {
			window.blvd.openBookingWidget({})
		} else {
			console.error('Booking widget is not available.')
		}
	}

	return (
		<button className='booking-button' onClick={handleBooking}>
			Book Now
		</button>
	)
}

export default BookingButton
