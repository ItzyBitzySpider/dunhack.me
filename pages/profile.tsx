import { signOut, useSession } from 'next-auth/react';
import { getChallengeByCategory } from '../server/databaseFunctions';

export default function Profile() {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1>Profiles page under construction</h1>
				<button
					onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}>
					Sign Out
				</button>
			</>
		);
	}else{
		return <h1>Unauthorized</h1>;
	}
}
