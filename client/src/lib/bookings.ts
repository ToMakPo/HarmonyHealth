export function handleBooking(service?: string, visitType: string = 'SELF_VISIT') {
	console.log('handleBooking called with service:', service, 'and visitType:', visitType)
	if (window.blvd && typeof window.blvd.openBookingWidget === 'function') {
		const locationId = import.meta.env.VITE_LOCATION_ID
		const urlParams = service ? { urlParams: { locationId, path: '/cart/menu/' + service, visitType } } : {}
		console.log('Opening booking widget with params:', urlParams)

		window.blvd.openBookingWidget(urlParams)
	} else {
		console.error('Booking widget is not available.')
	}
}
