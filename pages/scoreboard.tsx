import { useSession } from 'next-auth/react';
import { Col, Row } from 'react-bootstrap';
import TableRow from '../components/tableRow';
import { getScoreboard } from '../server/scoreFunctions';

export default function Scoreboard({ scores }) {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1 className='txt-center'>Scoreboard</h1>
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
									left={entry.position.toString()}
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
	const scores = await getScoreboard();
	return {
		props: { scores },
	};
}
