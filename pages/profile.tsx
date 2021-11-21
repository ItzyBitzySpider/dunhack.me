import { signOut } from 'next-auth/react';

export default function Profile() {
	return (
		<>
			<h1>Profiles page under construction</h1>
			<button onClick={() => signOut()}>Sign Out</button>
		</>
	);
}
