import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Row } from 'react-bootstrap';
import Challenge from '../components/challenge';
import {
	getAllChallenges,
	getChallengeSolved,
} from '../server/challengeFunctions';

export default function Challenges({ categories, solvedIDs }) {
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
									//TODO replace solved conditional with map checking stuff
									return (
										<Challenge
											key={challenge.id}
											chal={challenge}
											solved={solvedIDs.includes(challenge.id)}
										/>
									);
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
	const session = await getSession(context);
	if(!session) return {props:{}};
	const categories = await getAllChallenges();
	const userSolved = await getChallengeSolved(session['userId']);
	const solvedIDs = [];
	for (const solved of userSolved){
		solvedIDs.push(solved.challengeId);
	}
	return {
		props: { categories, solvedIDs },
	};
}
