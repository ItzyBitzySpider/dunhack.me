import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import ModalForm from '../components/modalForm';
import TableRow from '../components/tableRow';
import { changeUsername } from '../server/userFunctions';
import styles from '../styles/profile.module.scss';
import Router from 'next/router';

export default function Profile({ userData }) {
	const { data: session, status } = useSession();
	const [error, setError] = useState(null);

	const nameChange = async (newUsername, close) => {
		const data = {
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
	if (session) {
		return (
			<>
				<Row>
					<Col className={styles.container}>
						<h1>{session.user.username}</h1>
						<ModalForm
							title='Change Username'
							content='Enter new username'
							placeholder='Username'
							callback={nameChange}
							error={error}
							variant='secondary'
						/>
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
					{userData.solved.map((challenge, index) => {
						return (
							<TableRow
								key={index}
								left={index}
								middle={challenge.name}
								right={challenge.submission}
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

export async function getServerSideProps() {
	const userData = {
		user: {
			name: '',
			image: '',
		},
		solved: [{}],
	};
	return {
		props: {
			userData,
		},
	};
}
