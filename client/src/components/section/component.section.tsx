import './styles.section.sass'

export interface SectionType {
	/** This will be displayed above the title in smaller text to let the user know
	 * what the section is about. */
	label: string

	/** This will be the main heading of the section displayed prominently. */
	title: string

	/** These will be displayed as paragraphs within the section. */
	content: string

	/** This image will be shown to the side of the text content. */
	imageUrl?: string | string[]
}

const Section: React.FC<SectionType> = (props) => {
	const { label, title, content, imageUrl } = props

	return (
		<section className={`section section-${label.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`}>
			{!imageUrl || imageUrl.length === 0 ? null 
			: (
				<div className="section-image-container">
					{Array.isArray(imageUrl) 
						? imageUrl.map((url, idx) => <img key={idx} src={url} alt={title} />) 
						: <img src={imageUrl} alt={title} />
					}
				</div>
			)}

			<div className="section-text">
				<span className="section-label">{label}</span>

				<h2>{title}</h2>

				{content.split('\n').map((para, idx) => {
					para = para.trim()
					return para ? <p key={idx}>{para}</p> : null
				}).filter(Boolean)}
			</div>
		</section>
	)
}

export default Section

/** Represents a section of content with a label, title, content, and image. */
export class SectionInfo implements SectionType {
	private _label: string
	private _title: string
	private _content: string
	private _imageUrl: string | string[]

	constructor(data: SectionType) {
		this._label = data.label
		this._title = data.title
		this._content = data.content
		this._imageUrl = data.imageUrl || []
	}

	/** This will be displayed above the title in smaller text to let the user know
	 * what the section is about. */
	get label() { return this._label; }
	set label(value: string) { this._label = value; }

	/** This will be the main heading of the section displayed prominently. */
	get title() { return this._title; }
	set title(value: string) { this._title = value; }

	/** These will be displayed as paragraphs within the section. */
	get content() { return this._content; }
	set content(value: string) { this._content = value; }

	/** This image will be shown to the side of the text content. */
	get imageUrl() { return this._imageUrl; }
	set imageUrl(value: string | string[]) { this._imageUrl = value; }

	/** Convert the section to a JSON object. */
	toJSON() {
		return {
			label: this._label,
			title: this._title,
			content: this._content,
			imageUrl: this._imageUrl
		} as SectionType
	}

	/** Convert the section to a React component. */
	toComponent(key?: React.Key) {
		return <Section
			key={key}
			label={this._label}
			title={this._title}
			content={this._content}
			imageUrl={this._imageUrl}
		/>
	}
}

/** Manages a collection of Section instances. */
export class SectionList {
	private _items: SectionInfo[]

	constructor(sections: SectionType[]) {
		this._items = sections.map(info => new SectionInfo(info))
	}

	/**
	 * Get all sections that match the provided parameters.
	 * 
	 * @param params - The parameters to match against.
	 * @returns An array of matching sections.
	 */
	find(params: Partial<SectionType>): SectionInfo | null {
		const found = this._items.filter(item => {
			for (const key in params) {
				const typedKey = key as keyof SectionType
				if (item[typedKey] !== params[typedKey]) {
					return false
				}
			}
			return true
		})

		return found.length > 0 ? found[0] : null
	}

	/**
	 * Add a new section.
	 * 
	 * @param label - This will be displayed above the title in smaller text to let the user know
	 * what the section is about.
	 * @param title - This will be the main heading of the section displayed prominently.
	 * @param content - These will be displayed as paragraphs within the section.
	 * @param imageUrl - This image will be shown to the side of the text content.
	 * @param index - The position to insert the new section at. If not provided, the section will be added
	 * to the end.
	 * @returns The newly added section instance.
	 */
	add(label: string, title: string, content: string, imageUrl: string, index?: number): SectionInfo {
		// Create the new section instance.
		const newSection = new SectionInfo({ label, title, content, imageUrl })

		// Insert the new section at the specified index or at the end if no index is provided.
		if (index === undefined || index >= this._items.length) {
			// Add to the end.
			this._items.push(newSection)
		} else if (index <= 0) {
			// Add to the start.
			this._items.unshift(newSection)
		} else {
			// Insert at the specified index.
			this._items.splice(index, 0, newSection)
		}

		// Return the newly created section.
		return newSection
	}

	/**
	 * Move a section from one index to another.
	 * 
	 * @param fromIndex - The current index of the section to move.
	 * @param toIndex - The index to move the section to.
	 * @returns An object indicating whether the move was successful and a message.
	 */
	move(fromIndex: number, toIndex: number) {
		// Validate indices.
		if (fromIndex < 0 || fromIndex >= this._items.length) return { passed: false, message: 'The from index is out of bounds.' }
		if (toIndex < 0 || toIndex >= this._items.length) return { passed: false, message: 'The to index is out of bounds.' }

		// Move the section.
		const [movedItem] = this._items.splice(fromIndex, 1)
		this._items.splice(toIndex, 0, movedItem)

		// Return success.
		return { passed: true, message: 'Section moved successfully.' }
	}

	/**
	 * Remove a section at the specified index.
	 * 
	 * @param index - The index of the section to remove.
	 * @returns An object indicating whether the removal was successful and a message.
	 */
	remove(index: number) {
		if (index < 0 || index >= this._items.length) return { passed: false, message: 'The index is out of bounds.' }
		this._items.splice(index, 1)
		return { passed: true, message: 'Section removed successfully.' }
	}

	/** Convert the sections to a JSON array. */
	toJSON() {
		return this._items.map(item => item.toJSON())
	}

	/** Convert the sections to an array of React components. */
	toComponents() {
		return (
			<div className="sections">
				{this._items.map((item, idx) => item.toComponent(idx))}
			</div>
		)
	}
}