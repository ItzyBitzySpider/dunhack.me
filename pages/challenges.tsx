import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Challenge from '../components/challenge';

export default function Challenges({ challenges }) {
	const { data: session, status } = useSession();
	const [modalShow, setModalShow] = useState(false);
	if (!session) {
		return (
			<>
				<h1>Challenges</h1>
				<Challenge chal={challenges} />
			</>
		);
	} else {
		return <h1>Unauthorized</h1>;
	}
}

// Get challenges
export async function getServerSideProps(context) {
	const challenges = {
		title: 'Challenge Title',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus neque, auctor nec mollis in, suscipit a neque. Etiam interdum est eget magna vehicula, quis.',
		hint: 'hint',
		files: '',
		points: 500,
	};
	return {
		props: { challenges },
	};
}
