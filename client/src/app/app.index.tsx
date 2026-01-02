import ThemeToggle from './theme-toggle/theme-toggle.app'
import AppHeader from './header/header.app'

import GlobalProvider from './global-context/global.provider'
import AppRouter from './app.router'
import AppFooter from './footer/footer.app'

import './styles.colors.sass'
import './styles.icons.sass'
import './app.styles.sass'

const App: React.FC = () => {
	const appContent = (
		<GlobalProvider>
			<AppHeader />

			<main>
				<AppRouter />

				<AppFooter />
			</main>

			<ThemeToggle />
		</GlobalProvider>
	)

	return appContent
}

export default App