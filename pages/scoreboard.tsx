import { useSession } from 'next-auth/react';
import SidebarNavigation from '../components/sidebarNavigation';

export default function Scoreboard() {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<>
				<h1>Scoreboard page under construction</h1>
			</>
		);
	}else{
		return <h1>Unauthorized</h1>;
	}
}
