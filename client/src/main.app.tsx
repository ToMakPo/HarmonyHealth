import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './colors.styles.sass'
import './main.styles.sass'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
