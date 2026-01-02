import { joinClassNames } from "../../lib/utils"
import type ServiceInfo from "../../models/Service"

import './service-card.styles.sass'

export interface ServiceCardProps {
	id?: string | undefined
	className?: string | string[]
	
	/** The service information to be displayed in the card. */
	service: ServiceInfo
}

const ServiceCard: React.FC<ServiceCardProps> = ((props) => {
	const { name, description, imageUrl } = props.service

	const id = props.id || `service-card-${Math.random().toString(36).substr(2, 8)}`
	const className = joinClassNames('service-card', 'service-card-component', props.className)

	return (
		<div id={id}
			className={className}
			role='button'
			tabIndex={0}
			onClick={() => {window.location.href = `/service/${props.service.key}`}}
		>
			<img src={imageUrl} alt={name} className="service-card-image" />

			<span className="service-card-name">{name}</span>

			<p className="service-card-description">{description}</p>
		</div>
	)
})

export default ServiceCard