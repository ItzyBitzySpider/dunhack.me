import SidebarNavigation from '../components/sidebarNavigation';
import {signOut, useSession} from 'next-auth/react'

export default function Logout() {
    const {data: session, status} = useSession();
	return (
		<>
			{session && <button onClick={()=>signOut()}>Sign Out</button>}
		</>
	);
}
