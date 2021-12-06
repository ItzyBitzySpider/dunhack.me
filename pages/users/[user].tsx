import { useSession } from 'next-auth/react';
import TableRow from '../../components/tableRow';

export default function userProfile({ userData }) {
	const { data: session, status } = useSession();
	if (session) {
		if (session.user.name === userData.user.name)
			return { redirect: { destination: '/profile' } };
		return (
			<>
				<h1>{userData.user.name}</h1>
				<br />
				<img src={userData.user.image}></img>
				<br />
				<TableRow
					variant='header'
					left='S/N'
					middle='Challenge'
					right='Submission Time'
				/>
				{userData.solved.map((challenge, index) => {
					return (
						<TableRow
							left={index}
							middle={challenge.name}
							right={challenge.submission}
							variant={index % 2 === 0 ? 'dark' : 'light'}
						/>
					);
				})}
			</>
		);
	}
}

export async function getStaticPaths() {
	return;
}

export async function getStaticProps({ paramas }) {
	const userData = {
        user: {
            name: '',
            image: '',
        },
        solved: [{}]
    };
	return {
		props: {
			userData,
		},
	};
}
