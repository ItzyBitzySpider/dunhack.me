import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Challenge from '../components/challenge';
import { getAllChallenges, getChallengeByCategory, getChallengeByCTF } from '../server/challengeFunctions';

export default function Challenges({ categories }) {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1>Challenges</h1>
				<br />
				{categories.map((category) => {
					return (
						<>
							<h2 key={category.name}>{category.name}</h2>
							<br />
							<Row>
							{category.challenges.map((challenge) => {
								return <Challenge key={challenge.id} chal={challenge} />;
							})}
							</Row>
							<br />
						</>
					);
				})}
			</>
		);
	} else {
		return <h1>Unauthorized</h1>;
	}
}

// Get challenges
export async function getServerSideProps(context) {
	const categories = await getAllChallenges();
	return {
		props: { categories },
	};
}
