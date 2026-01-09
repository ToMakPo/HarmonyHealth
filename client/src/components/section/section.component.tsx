import { useMemo } from 'react'

import './section.styles.sass'

export interface SectionType {
	/** This will be displayed above the title in smaller text to let the user know what the section is about. */
	label: string

	/** This will be the main heading of the section displayed prominently. */
	title: string

	/** These will be displayed as paragraphs within the section. */
	content: string

	/** This image will be shown to the side of the text content. */
	imageUrl: string | string[] | null
}

const ContentSection: React.FC<SectionType> = (props) => {
	const { label, title, content, imageUrl } = props

	/** The image element(s) to be displayed alongside the text content. */
	const imageEl = useMemo(() => imageUrl && imageUrl.length > 0 && (
		<div className="section-image-container">
			{Array.isArray(imageUrl)
				? imageUrl.map((url, idx) => <img key={idx} src={url} alt={title} />)
				: <img src={imageUrl} alt={title} />
			}
		</div>
	), [imageUrl, title])

	/** The label element of the section. */
	const labelEl = useMemo(() => <span className="section-label">{label}</span>, [label])

	/** The title element of the section. */
	const titleEl = useMemo(() => <h2 className="section-title">{title}</h2>, [title])

	/** The main text for the section, split into paragraphs. */
	const textEl = useMemo(() => content.split('\n').map((para, idx) => {
		para = para.trim()
		return para ? <p key={idx}>{para}</p> : null
	}).filter(Boolean), [content])

	return (
		<section className={`section section-${label.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`}>
			{imageEl}

			<div className="section-text-container">
				{labelEl}
				{titleEl}
				{textEl}
			</div>
		</section>
	)
}

export default ContentSection