import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from '../pages/home/page.home'
import ServicePage from '../pages/service/page.service'

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/service/:serviceKey',
		element: <ServicePage />
	}
])

export default function AppRouter() {
	return <RouterProvider router={router} />
}