import type { JSX } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from '../pages/home/home.page'
import ServicesPage from '../pages/services/services.page'
import ServicePage from '../pages/service/service.page'

/** Creates a route object to be used in the router.
 * 
 * @param path The path of the route
 * @param element The element to render for the route
 * @returns An object representing the route
 */
const setRoute = (path: string, element: JSX.Element) => ({ path, element })

/** The main application router.
 * 
 * Defines the routes and their corresponding components.
 */
const router = createBrowserRouter([
	setRoute('/', <HomePage />),
	setRoute('/services', <ServicesPage />),
	setRoute('/service/:serviceKey', <ServicePage />)
])

export default function AppRouter() {
	return <RouterProvider router={router} />
}