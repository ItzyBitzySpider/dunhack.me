import Form from 'react-bootstrap/Form';
import SidebarNavigation from '../components/sidebarNavigation';
import {signIn, useSession} from 'next-auth/react'

export default function Login() {
    const {data: session, status} = useSession();
	return (
		<>
			<SidebarNavigation />
			{!session && <button onClick={()=>signIn()}>Sign In</button>}
		</>
	);
}
