import { useSession } from 'next-auth/react';

export default function Challenges() {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1>Challenges page under construction</h1>
			</>
		);
	}else{
		return <h1>Unauthorized</h1>;
	}
}
