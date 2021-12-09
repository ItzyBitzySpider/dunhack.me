import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { Row, Col } from 'react-bootstrap';
import TableRow from '../../components/tableRow';
import { getChallengesSolved } from '../../server/challengeFunctions';
import { getAllUsers, getUserInfo } from '../../server/userFunctions';
import styles from '../../styles/profile.module.scss';

export default function userProfile({ userData, challengeSolved }) {
	const { data: session, status } = useSession();
	if (session) {
		//TODO: fix
		// if (session.user.username === userData.username) {
		// 	return  Router.push('/profile');
		// }
		return (
			<>
				<Row>
					<Col className={styles.container}>
						<h1>{userData.username}</h1>
					</Col>
					<Col>
						<img className={styles.imageContainer} src={userData.image} />
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
								left={index + 1}
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

export async function getStaticPaths() {
	const users = await getAllUsers();
	let paths = [];
	if (users) {
		paths = users.map((user) => {
			return {
				params: {
					user: user.username,
				},
			};
		});
	}
	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps(pathData) {
	const userData = await getUserInfo(pathData.params.user);
	const challengeSolved = await getChallengesSolved(userData.id);
	return {
		props: {
			userData,
			challengeSolved,
		},
	};
}
