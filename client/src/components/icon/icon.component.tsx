import { forwardRef } from 'react'
import './icon.styles.scss'

type MaterialSymbolVariant = 'outlined' | 'rounded' | 'sharp'

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** The name of the icon to display, e.g., 'search', 'home', 'settings' */
	name: string
	/** The size of the icon. Can be a number (in pixels) or a string (e.g., '2rem', '24px'). Defaults to '1.5rem' */
	size?: number | string
	/** The variant of the Material Symbol to use. Can be 'outlined', 'rounded', or 'sharp'. Defaults to 'outlined' */
	variant?: MaterialSymbolVariant
	/** Whether the icon is filled. Defaults to false */
	filled?: boolean
	/** Whether the icon is disabled. Defaults to false */
	disabled?: boolean
}

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
	const {
		name,
		size = props.size === undefined ? '1.5rem' : typeof props.size === 'number' ? `${props.size}px` : props.size,
		variant = 'outlined',
		filled = false,
		disabled = false,
		className = '',
		style,
		onClick,
		...restProps
	} = props

	const classes = [
		'icon-component',
		onClick ? 'clickable' : '', // Add 'clickable' class if onClick is provided
		disabled ? 'disabled' : '', // Add 'disabled' class if disabled is true
		className ?? '' // Preserve any additional classes passed via props
	]
		.filter(Boolean)
		.join(' ')

	const styles = {
		'--size': size, // Custom CSS variable setting the size of the icon.
		'--fill': Number(filled), // Custom CSS variable setting the fill of the icon.
		...props.style // Spread any additional styles passed via props.
	} as React.CSSProperties

	const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		if (disabled) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		onClick?.(event)
	}

	return (
		<span id={props.id} className={classes} style={styles} onClick={handleClick} {...restProps} ref={ref} aria-disabled={disabled}>
			<span className={`material-symbols-${variant} material-symbols`}>{name}</span>
		</span>
	)
})

Icon.displayName = 'Icon'

export default Icon
