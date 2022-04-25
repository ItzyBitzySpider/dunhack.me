import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import styles from '../styles/modalForm.module.scss';
export default function ModalForm({
	title,
	content,
	callback,
	error,
	placeholder,
	variant,
	style,
}: {
	title: string;
	content: string;
	callback: Function;
	error?: string;
	placeholder: string;
	variant: string;
	style?: string;
}) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [formValue, setValue] = useState('');
	return (
		<>
			<Button variant={variant} onClick={handleShow} className={style}>
				{title}
			</Button>
			<Modal
				dialogClassName={styles.modal}
				show={show}
				onHide={handleClose}
				centered>
				<Modal.Header>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{content}</Modal.Body>

				<Modal.Footer as={Row} className='justify-content-center g-0'>
					<Row className='g-1'>
						<Col md={10}>
							<input
								className={styles.inputField}
								value={formValue}
								onInput={(e) =>
									setValue((e.target as HTMLTextAreaElement).value)
								}
								placeholder={placeholder}
							/>
						</Col>
						<Col md={2}>
							<Button
								className={styles.submit}
								variant='outline-primary'
								onClick={() => callback(formValue, handleClose)}>
								Confirm
							</Button>
						</Col>
					</Row>
					<Row className='g-1 mb-0 mt-0'>
						<div style={{ color: 'red' }}>{error}</div>
					</Row>
				</Modal.Footer>
			</Modal>
		</>
	);
}
