import { getSession, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import ModalForm from '../components/modalForm';
import TableRow from '../components/tableRow';
import { changeUsername } from '../server/userFunctions';
import styles from '../styles/profile.module.scss';
import Router from 'next/router';
import { getChallengesSolved } from '../server/challengeFunctions';

export default function Profile({ challengeSolved }) {
	const { data: session, status } = useSession();
	const [error, setError] = useState(null);

	const nameChange = async (newUsername, close) => {
		const data = {
			userId: session.user.id,
			username: newUsername,
		};
		const response = await fetch('/api/changeUsername', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		let res = await response.json();

		if (res.result !== undefined) {
			// Username change successful
			if (res.result === true) {
				close();
				Router.reload();
				return;
			} else {
				// Display error to user
				setError('Username not available');
				return;
			}
		} else {
			setError(res.error);
			return;
		}
	};

	const delAccount = async (confirmation, close) => {
		//Check user delete is intended
		if (confirmation !== session.user.username) {
			setError('Confirmation invalid');
			return;
		}
		const data = {
			userId: session.user.id,
		};
		const response = await fetch('/api/deleteUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		let res = await response.json();

		if (res.result !== undefined) {
			// Account delete successful
			if (res.result === true) {
				close();
				Router.push('/');
				return;
			} else {
				// Display error to user
				setError('Something went wrong. Please contact admin.');
				return;
			}
		} else {
			setError(res.error);
			return;
		}
	};
	if (session) {
		return (
			<>
				<Row>
					<Col className={styles.container}>
						<h1>{session.user.username}</h1>
						<div>
							<ModalForm
								title='Change Username'
								content='Enter new username'
								placeholder='Username'
								callback={nameChange}
								error={error}
								variant='secondary'
							/>
						</div>
						<div className='pt-2'>
							<ModalForm
								title='Delete Account'
								content="You're about to permanently delete this account. This action is not reversible. To confirm, please enter your username."
								placeholder={session.user.username}
								callback={delAccount}
								error={error}
								variant='danger'
							/>
						</div>
					</Col>
					<Col>
						<img className={styles.imageContainer} src={session.user.image} />
					</Col>
				</Row>
				<br />
				<Row className='justify-content-center g-1'>
					<TableRow
						variant='header'
						left='S/N'
						middle='Challenge'
						right='Submission Time'
					/>
					{challengeSolved.map((challenge, index) => {
						return (
							<TableRow
								key={index}
								left={index+1}
								middle={challenge.title}
								right={challenge.added}
								variant={index % 2 === 0 ? 'dark' : 'light'}
							/>
						);
					})}
				</Row>
			</>
		);
	} else {
		return <h1>Unauthorized</h1>;
	}
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const challengeSolved = await getChallengesSolved(session.user.id);
	return {
		props: {
			challengeSolved,
		},
	};
}
