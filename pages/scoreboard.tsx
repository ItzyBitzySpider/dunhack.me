import { useSession } from 'next-auth/react';
import { Col, Row } from 'react-bootstrap';
import TableRow from '../components/tableRow';

export default function Scoreboard({ scores }) {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1>Scoreboard</h1>
				{/* <Row className='justify-content-center'> */}
				<Row>
					<Col md={12}>
						<TableRow
							left='Rank'
							middle='Username'
							right='Points'
							variant='header'
						/>
						{scores.map((entry, index) => {
							console.log(entry);
							return (
								<TableRow
									left={entry.pos.toString()}
									middle={entry.username}
									right={entry.score}
									variant={index % 2 === 0 ? 'dark' : 'light'}
								/>
							);
						})}
					</Col>
				</Row>
			</>
		);
	} else {
		return <h1>Unauthorized</h1>;
	}
}

export async function getServerSideProps(context) {
	const scores = [
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
		{ pos: 1, username: 'dbsqewrty123', score: -1337 },
		{ pos: 2, username: 'dbsqewrty123', score: -1337 },
		{ pos: 3, username: 'dbsqewrty123', score: -1337 },
	];
	return {
		props: { scores },
	};
}
