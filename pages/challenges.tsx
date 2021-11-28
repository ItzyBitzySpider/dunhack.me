import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Challenge from '../components/challenge';
import { getAllChallenges, getChallengeByCategory, getChallengeByCTF, runner } from '../server/database';

export default function Challenges({ categories }) {
	const { data: session, status } = useSession();
	const [modalShow, setModalShow] = useState(false);
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

	const categories = [
		{
			name: 'Web',
			challenges: [
				{
					title: 'Web Challenge Title',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},
				{
					title: 'Web Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},{
					title: 'Web Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},{
					title: 'Web Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},{
					title: 'Web Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},{
					title: 'Web Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},{
					title: 'Web Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},
			],
		},
		{
			name: 'Crypto',
			challenges: [
				{
					id: 1,
					title: 'Crypto Challenge Title',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: ['hint'],
					files: [''],
					points: 500,
				},
				{
					id: 2,
					title: 'Crypto Challenge Title 2',
					description:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
					hint: [''],
					files: [''],
					points: 500,
				},
			],
		},
	];
	return {
		props: { categories },
	};
}
