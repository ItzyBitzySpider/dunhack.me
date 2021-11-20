import Form from 'react-bootstrap/Form';
import SidebarNavigation from '../components/sidebarNavigation';

export default function Login() {
	return (
		<>
			<SidebarNavigation />
			<Form.Group>
				<Form.Label>Email address</Form.Label>
				<Form.Control type='email' placeholder='Enter email' />
			</Form.Group>
			<Form.Group className='mb-3' controlId='formGroupPassword'>
				<Form.Label>Password</Form.Label>
				<Form.Control type='password' placeholder='Password' />
			</Form.Group>
		</>
	);
}
