import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Card, Form, Modal, Row, Col } from 'react-bootstrap';
import styles from '../styles/challenge.module.scss';

export default function Challenge({ chal }: { chal: any }) {
	const { title, description, hint, files, points } = chal;
	const [show, setShow] = useState(false);
	const [flag, setFlag] = useState('');
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const submit = async () => {
		const data = {
			challengeId: chal.id,
			flag: flag,
		};
		console.log(JSON.stringify(data))
		const response = await fetch('/api/submitFlag', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		let result = await response.text();
		console.log(result);
	};

	return (
		<>
			<button className={styles.btnCard} onClick={handleShow}>
				<Card className={styles.card} style={{ width: '21rem' }}>
					<Card.Body>
						<Card.Title>{title}</Card.Title>
						<Card.Text>{points}</Card.Text>
					</Card.Body>
				</Card>
			</button>
			<Modal
				dialogClassName={styles.modal}
				show={show}
				onHide={handleClose}
				centered>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{description}</Modal.Body>
				<button className={styles.hint}>&gt; Hint</button>
				<Modal.Footer as={Row} className='justify-content-center g-0'>
					<Row className='g-1'>
						<Col md={10}>
							<input className={styles.inputField}
								value={flag}
								onInput={(e) => setFlag((e.target as HTMLTextAreaElement).value)}
								placeholder='CTF{Your_Flag_Here}'
							/>
						</Col>
						<Col md={2}>
							<Button className={styles.submit} onClick={submit}>
								Submit
							</Button>
						</Col>
					</Row>
				</Modal.Footer>
			</Modal>
		</>
	);
}
