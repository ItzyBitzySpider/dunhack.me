import { useState } from 'react';
import {
	Button,
	Card,
	Modal,
	Row,
	Col,
	Accordion,
	useAccordionButton,
} from 'react-bootstrap';
import styles from '../styles/challenge.module.scss';
import { challenge_type } from '../types/custom';

function HintToggle({ children, eventKey }) {
	const reveal = useAccordionButton(eventKey);
	return (
		<button type='button' className={styles.btnHint} onClick={reveal}>
			{children}
		</button>
	);
}

export default function Challenge({ chal }: { chal: challenge_type }) {
	const { id, title, description, ctfName, hints, files, points, solves } =
		chal;
	const [show, setShow] = useState(false);
	const [flag, setFlag] = useState('');
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const submit = async () => {
		const data = {
			challengeId: id,
			flag: flag,
		};
		const response = await fetch('/api/submitFlag', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		let result = await response.text();
	};

	return (
		<>
			<button className={styles.btnCard} onClick={handleShow}>
				<Card className={styles.card} style={{ width: '21rem' }}>
					<Card.Body>
						<Card.Title>
							[{ctfName.name}] {title}
						</Card.Title>
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
					<Row>
						<Modal.Title>{title}</Modal.Title>
						<div className={styles.solve}>Solves: {solves}</div>
					</Row>
				</Modal.Header>
				<Modal.Body>{description}</Modal.Body>
				{hints.map((content, index) => {
					return (
						<Accordion>
							<Card className={styles.empty}>
								<Card.Header className={styles.btnHint}>
									<HintToggle eventKey={index.toString()}>Hint {index+1}</HintToggle>
								</Card.Header>
								<Accordion.Collapse eventKey={index.toString()}>
									<Card.Body className={styles.hintContent}>{content.body}</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					);
				})}
				
				<Modal.Footer as={Row} className='justify-content-center g-0'>
					<Row className='g-1'>
						<Col md={10}>
							<input
								className={styles.inputField}
								value={flag}
								onInput={(e) =>
									setFlag((e.target as HTMLTextAreaElement).value)
								}
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
