import { forwardRef, useImperativeHandle, useRef } from "react"
import { joinClassNames } from "../../lib/utils"
import './styles.service-card.sass'

export interface ServiceCardProps {
	id?: string | undefined
	className?: string | string[]

	title: string
	description: string
	imageSrc: string

	onClick?: () => void
}

export interface ServiceCardRef {
	focus: () => void
}

const ServiceCard = forwardRef<ServiceCardRef, ServiceCardProps>((props, ref) => {
	const cardRef = useRef<HTMLDivElement>(null)

	const id = props.id || `service-card-${Math.random().toString(36).substr(2, 8)}`
	const className = joinClassNames('service-card', 'service-card-component', props.className)

	useImperativeHandle(ref, () => ({
		focus: () => {
			if (cardRef.current) cardRef.current.focus()
		}
	}))

	return <>
		<div id={id} 
			className={className}
			role={props.onClick ? 'button' : undefined}
			tabIndex={props.onClick ? 0 : undefined}
			onClick={props.onClick}
			ref={cardRef}
		>
			<img src={props.imageSrc} alt={props.title} className="service-card-image" />
			
			<span className="service-card-title">{props.title}</span>

			<p className="service-card-description">{props.description}</p>
		</div>
	</>
})

export default ServiceCard