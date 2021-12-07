import { useSession } from 'next-auth/react';
import { Col, Row } from 'react-bootstrap';
import TableRow from '../components/tableRow';

export default function Scoreboard({ scores }) {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1>Scoreboard</h1>
				<Row>
					<Col className='g-5'>
						<TableRow
							left='Rank'
							middle='Username'
							right='Points'
							variant='header'
						/>
						{scores.map((entry, index) => {
							return (
								<TableRow
									left={entry.pos.toString()}
									middle={entry.username} //TODO make username clickable
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
