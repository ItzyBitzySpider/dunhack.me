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
import ReactMarkdown from 'react-markdown';
import styles from '../styles/challenge.module.scss';
import { challenge_type } from '../types/custom';

function HintToggle({ children, eventKey }) {
	const reveal = useAccordionButton(eventKey);
	return (
		<Button className={styles.btnHint} onClick={reveal}>
			{children}
		</Button>
	);
}

export default function Challenge({
	chal,
	solved,
	activeInstance,
}: {
	chal: challenge_type;
	solved: Boolean;
	activeInstance: any; //TODO: type this later
}) {
	const {
		id,
		title,
		description,
		ctfName,
		hash,
		service,
		hints,
		files,
		points,
		solves,
	} = chal;
	const [solveCount, setCount] = useState(solves);
	const [error, setError] = useState('');
	const [show, setShow] = useState(false);
	const [flag, setFlag] = useState('');
	const [userSolved, showSolve] = useState(solved);
	const [active, setActive] = useState(activeInstance.Challenge_Name === title); //TODO replace redundant check if name matches
	const [instanceDetails, setInstanceDetails] = useState(activeInstance.Challenge_Name === title ? `http://portainer.dunhack.me:${activeInstance.Ports_Used}` : '');
	const [instanceError, setInstanceError] = useState('');

	const handleClose = () => {
		setShow(false);
		setError('');
	};

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
		let res = await response.json();

		if (res.result !== undefined) {
			// Flag is correct
			if (res.result === true) {
				setCount(solves + 1);
				showSolve(true);
				handleClose();
				return;
			} else {
				// Display error to user
				setError('Flag is incorrect');
				return;
			}
		} else {
			setError(res.error);
			return;
		}
	};

	const startInstance = async (hash) => {
		const data = {
			challengeHash: hash,
		};
		const response = await fetch('/api/startInstance', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		let res = await response.json();
		console.log('response', response);
		if (response.status === 200) {
			setInstanceError('');
			setInstanceDetails(`http://portainer.dunhack.me:${res.Ports_Used[0]}`);
			setActive(true);
		} else {
			setInstanceError(res.error);
		}
	};

	const stopInstance = async () => {
		const response = await fetch('/api/stopInstance', {
			method: 'POST'
		});

		let res = await response.json();
		console.log(res)
		if (response.status === 200 || res.error === 'User does not have an instance') {
			setInstanceError('');
			setInstanceDetails('');
			setActive(false);
		} else {
			setInstanceError(res.error);
		}
	};

	const extendTime = async () => {
		const response = await fetch('/api/extendTimeInstance', {
			method: 'POST'
		});

		// let res = await response.json();
		console.log(response)
		// if (response.status === 200 || res.error === 'User does not have an instance') {
		// 	setInstanceError('');
		// 	setInstanceDetails('');
		// } else {
		// 	setInstanceError(res.error);
		// }
	};

	return (
		<>
			{!userSolved && (
				<button
					className={active ? styles.activeInstance : styles.btnCard}
					onClick={handleShow}>
					<Card className={styles.card} style={{ width: '20rem' }}>
						<Card.Body>
							<Card.Text className={styles.ctfName}>{ctfName.name}</Card.Text>
							<Card.Title className={styles.ctfTitle}>{title}</Card.Title>
							<Card.Text>{points}</Card.Text>
						</Card.Body>
					</Card>
				</button>
			)}
			{userSolved && (
				<button className={styles.btnCardSolved} onClick={handleShow}>
					<Card className={styles.cardSolved} style={{ width: '20rem' }}>
						<Card.Body>
							<Card.Text>{ctfName.name}</Card.Text>
							<Card.Title className={styles.ctfTitle}>{title}</Card.Title>
							<Card.Text>{points}</Card.Text>
						</Card.Body>
					</Card>
				</button>
			)}
			<Modal
				dialogClassName={styles.modal}
				show={show}
				onHide={handleClose}
				centered>
				<Modal.Header className={styles.modalHeader}>
					<Row>
						<Modal.Title>{title}</Modal.Title>
						<div className={styles.solve}>Solves: {solveCount}</div>
					</Row>
				</Modal.Header>
				<Modal.Body>
					<ReactMarkdown children={description} />
					{service && (
						<>
							<div className={styles.subheader}>Instance</div>
							<div style={{ color: 'red' }}>{instanceError}</div>
							<div>{instanceDetails}</div>
							{/* TODO check better way to verify there is no instance available */}
							{instanceDetails === '' && (
								<Button
									className={styles.serviceStart}
									onClick={() => {
										startInstance(hash);
									}}>
									Start Instance
								</Button>
							)}
							{instanceDetails !== '' && (
								<div className={styles.instanceRow}>
									<Button
										className={styles.serviceExtend}
										onClick={() => {
											extendTime();
										}}>
										Extend Time
									</Button>
									<Button
										className={styles.serviceStop}
										onClick={() => {
											stopInstance();
										}}>
										Stop Instance
									</Button>
								</div>
							)}
						</>
					)}
				</Modal.Body>
				{files[0] && (
						<Modal.Body>
							<div className={styles.subheader}>Challenge Files</div>
							<Row className='mt-2'>
								{files.map((file) => {
									return (
										<Col>
											<Button
												target='_blank'
												href={file.url}
												variant='secondary'>
												{file.title}
											</Button>
										</Col>
									);
								})}
							</Row>
						</Modal.Body>
				)}

				{hints[0] && (
						<Modal.Body>
							<div className={styles.subheader}>Hints</div>
							{hints.map((content, index) => {
							return (
								<Accordion>
									<Card className={styles.cardHint}>
										<Card.Header className={styles.cardHint}>
											<HintToggle eventKey={index.toString()}>
												Hint {index + 1}
											</HintToggle>
										</Card.Header>
										<Accordion.Collapse eventKey={index.toString()}>
											<Card.Body className={styles.hintContent}>
												<ReactMarkdown children={content.body} />
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>
							);
						})}
						</Modal.Body>
				)}

				<Modal.Footer as={Row} className='justify-content-center g-0'>
					{!userSolved && (
						<>
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
									<Button
										className={styles.submit}
										// variant='outline-primary'
										onClick={submit}>
										Submit
									</Button>
								</Col>
							</Row>
							<Row className='g-1 mb-0 mt-0'>
								<div style={{ color: 'red' }}>{error}</div>
							</Row>
						</>
					)}
					{userSolved && (
						<>
							<Row className='g-1 justify-content-center'>Challenge Solved</Row>
						</>
					)}
				</Modal.Footer>
			</Modal>
		</>
	);
}
