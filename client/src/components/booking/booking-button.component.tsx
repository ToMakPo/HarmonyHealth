import { scrollToHashElement } from '../../app'

import './booking-button.styles.scss'

function BookingButton() {
	function handleBooking() {
		console.log('Booking button clicked')
		scrollToHashElement('/', 'book-now')
	}

	return (
		<button className='booking-button' onClick={handleBooking}>
			Book Now
		</button>
	)
}

export default BookingButton
