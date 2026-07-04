import { useTheme } from '../../store/theme'
import './light-dark.styles.scss'

function LightDarkToggle() {
	const theme = useTheme(state => state.theme)
	const setTheme = useTheme(state => state.setTheme)

	return (
		<div
			className='light-dark-toggle'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		/>
	)
}

export default LightDarkToggle
