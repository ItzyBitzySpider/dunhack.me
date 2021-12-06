import { signOut, useSession } from 'next-auth/react';
import { Button, Row, Col } from 'react-bootstrap';
import TableRow from '../components/tableRow';
import styles from '../styles/profile.module.scss';

export default function Profile({ userData }) {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<Row>
					<Col className={styles.container}>
						<h1>{session.user.username}</h1>
						<Button variant='secondary'>Change Username</Button>
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
