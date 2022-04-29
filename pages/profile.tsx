import { getSession, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import ModalForm from '../components/modalForm';
import TableRow from '../components/tableRow';
import { changeUsername } from '../server/userFunctions';
import dayjs from 'dayjs';
import styles from '../styles/profile.module.scss';
import Router from 'next/router';
import { getChallengesSolved } from '../server/challengeFunctions';
import Unauthorized from '../components/unauthorized';

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
				Router.push('/login')
				Router.reload();
				return;
			} else {
				// Display error to user
				setError('Delete failed');
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
			<br/>
				<h1 className='txt-center'>{session.user.username}'s Profile</h1>
				<Row className='justify-content-center'>
					<img className={styles.imageContainer} src={session.user.image} />
				</Row>
				<Row className={styles.border}>
					<Col className='g-0 align-items-center'>
						<h2 className={styles.txt}>User Submissions</h2>
					</Col>
					<Col className={styles.buttonCluster}>
						<div className='px-3'>
							<ModalForm
								style={styles.btn}
								title='Change Username'
								content='Enter new username'
								placeholder='Username'
								callback={nameChange}
								error={error}
								variant='secondary'
							/>
						</div>
						<div>
							<ModalForm
								style={styles.btn}
								title='Delete Account'
								content="You're about to permanently delete this account. This action is not reversible. To confirm, please enter your username."
								placeholder={session.user.username}
								callback={delAccount}
								error={error}
								variant='danger'
							/>
						</div>
					</Col>
				</Row>
				<br />
				<Row className='justify-content-center g-0'>
					<TableRow
						variant='header'
						left='No.'
						middle='Challenge'
						right='Submission Time'
					/>
					{challengeSolved.map((challenge, index) => {
						return (
							<TableRow
								key={index}
								left={index + 1}
								middle={challenge.title}
								right={dayjs(challenge.added).format('DD MMM YYYY, HH:mm:ss')}
								variant={index % 2 === 0 ? 'dark' : 'light'}
							/>
						);
					})}
				</Row>
			</>
		);
	} else if (error === "Delete failed"){
		return ( 	
			<div className='txt-center h-100 align-items-center row'>
				<div>
					<h1>Something went wrong</h1>
					<h3>
						Account has not been deleted. Please <a href='/login'>login</a> and try again. 
					</h3>
				</div>
			</div>
		);
	}else {
		return <Unauthorized />;
	}
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (!session) return { props: { challengeSolved: [] } };
	let challengeSolved = await getChallengesSolved(session.user.id);
	if (!challengeSolved) {
		challengeSolved = [];
	}
	return {
		props: {
			challengeSolved,
		},
	};
}
