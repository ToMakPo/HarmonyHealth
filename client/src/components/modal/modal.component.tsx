import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { joinClassNames } from '../../lib/utils'
import './modal.styles.sass'

export interface ModalProps {
	id?: string | undefined
	classNames?: string | string[]

	header?: string

	open?: boolean

	onOpen?: () => void
	onClose?: () => void

	children: React.ReactNode
}

export interface ModalRef {
	isOpen: boolean
	open: () => void
	close: () => void
	toggle: () => void
}

const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
	const [isOpen, setIsOpen] = useState(!!props.open)

	const dialogRef = useRef<HTMLDialogElement>(null)

	const id = props.id || `modal-${Math.random().toString(36).substr(2, 8)}`
	const classNames = joinClassNames('modal', '.modal-component', isOpen ? 'opened' : '', props.classNames)

	const modalProps = {
		id, classNames,
		'aria-modal': 'true',
		'aria-labelledby': `${id}-header`
	} as React.DialogHTMLAttributes<HTMLDialogElement>

	const open = () => {
		setIsOpen(true)

		if (dialogRef.current) dialogRef.current.showModal()
		if (props.onOpen) props.onOpen()
	}

	const close = () => {
		setIsOpen(false)

		if (dialogRef.current) dialogRef.current.close()
		if (props.onClose) props.onClose()
	}

	const toggle = () => {
		if (isOpen) close()
		else open()
	}

	useImperativeHandle(ref, () => ({ isOpen, open, close, toggle }))

	return <>
		<dialog {...modalProps} ref={dialogRef} onClose={close}>
			{!isOpen ? null : <>
				{props.header && <h2 id={`${id}-header`} className="modal-header">{props.header}</h2>}
				{props.children}
				<button type="button" className="modal-close" onClick={close} aria-label="Close modal">&times;</button>
			</>}
		</dialog>
	</>
})

export default Modal