import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { joinClassNames } from '../../lib/utils'

import './modal.styles.sass'

export interface ModalProps {
	id?: string | undefined
	className?: string | string[]

	/** The header text displayed at the top of the modal.
	 * 
	 * If not provided, no header will be shown.
	 */
	header?: string

	/** Controls whether the modal is open or closed. */
	open?: boolean

	/** Callback fired when the modal is opened. */
	onOpen?: () => void
	/** Callback fired when the modal is closed. */
	onClose?: () => void

	/** The content to be displayed inside the modal. */
	children: React.ReactNode
}

export interface ModalRef {
	/** Indicates whether the modal is currently open. */
	isOpen: boolean

	/** Opens the modal. */
	open: () => void
	/** Closes the modal. */
	close: () => void
	/** Toggles the modal's open/closed state. */
	toggle: () => void
}

/** The `Modal` component provides a dialog box that can be opened and closed.
 * 
 * It supports an optional header, and can be controlled via props or imperative methods.
 */
const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
	/** A reference to the underlying dialog HTML element. */
	const dialogRef = useRef<HTMLDialogElement>(null)

	/** Indicates whether the modal is currently open. */
	const [isOpen, setIsOpen] = useState<boolean>(false)

	/** The id of the modal element. */
	const id = props.id || `modal-${Math.random().toString(36).substr(2, 8)}`
	/** The combined class name(s) for the modal element. */
	const className = joinClassNames('modal', 'modal-component', isOpen ? 'opened' : '', props.className)

	/** Opens the modal and triggers the `onOpen` callback if provided. */
	const open = useCallback(() => {
		setIsOpen(true)

		if (dialogRef.current) dialogRef.current.showModal()
		if (props.onOpen) props.onOpen()
	}, [props])

	/** Closes the modal and triggers the `onClose` callback if provided. */
	const close = useCallback(() => {
		setIsOpen(false)

		if (dialogRef.current) dialogRef.current.close()
		if (props.onClose) props.onClose()
	}, [props])

	/** Toggles the modal's open/closed state. */
	const toggle = () => {
		if (isOpen) close()
		else open()
	}

	/** Opens or closes the modal based on the `open` prop. */
	useEffect(() => { if (props.open) open(); else close() }, [close, open, props.open])

	useImperativeHandle(ref, () => ({ isOpen, open, close, toggle }))

	/** The header element of the modal, if a header prop is provided. */
	const headerEl = useMemo(() => props.header && (
		<h2 id={`${id}-header`} className="modal-header">{props.header}</h2>
	), [props.header, id])

	/** The close button element of the modal. */
	const closeButtonEl = useMemo(() => (
		<button
			className="modal-close-button"
			type="button"
			onClick={close}
			aria-label="Close modal"
		>❌</button>
	), [close])

	return isOpen && (
		<dialog
			id={id}
			className={className}
			aria-modal="true"
			aria-labelledby={`${id}-header`}
			ref={dialogRef}
			onClose={close}
		>
			{headerEl}
			{props.children}
			{closeButtonEl}
		</dialog>
	)
})

export default Modal