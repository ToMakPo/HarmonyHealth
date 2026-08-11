import { handleBooking } from '../../lib/bookings'

import './booking-button.styles.scss'

function BookingButton() {
	return (
		<button className='booking-button' onClick={() => handleBooking()}>
			Book Now
		</button>
	)
}

export default BookingButton
