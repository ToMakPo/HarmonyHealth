export function handleBooking(service?: string, visitType: string = 'SELF_VISIT') {
	if (window.blvd && typeof window.blvd.openBookingWidget === 'function') {
		const locationId = import.meta.env.VITE_LOCATION_ID
		const urlParams = service ? { urlParams: { locationId, path: '/cart/menu/' + service, visitType } } : {}

		window.blvd.openBookingWidget(urlParams)
	} else {
		console.error('Booking widget is not available.')
	}
}
