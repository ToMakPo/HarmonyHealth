import { useTheme } from '../../store/theme'
import Icon from '../icon/icon.component'
import './light-dark.styles.scss'

function LightDarkToggle() {
	const theme = useTheme(state => state.theme)
	const setTheme = useTheme(state => state.setTheme)

	return (
		<Icon
			name={theme !== 'light' ? 'dark_mode' : 'light_mode'}
			className='light-dark-toggle'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		/>
	)
}

export default LightDarkToggle
