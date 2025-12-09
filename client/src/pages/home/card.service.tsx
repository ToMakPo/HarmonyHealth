interface ServiceCardProps {
	title: string
	description: string
	imagePath: string
}

const ServiceCard: React.FC<ServiceCardProps> = (props) => {
	const { title, description, imagePath } = props

	return (
		<div className='service-card'>
			<img src={imagePath} alt={title} className='service-card-image' />
			<h3 className='service-card-title'>{title}</h3>
			<p className='service-card-description'>{description}</p>
		</div>
	)	
}

export default ServiceCard
