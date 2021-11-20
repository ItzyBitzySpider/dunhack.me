import Form from 'react-bootstrap/Form';
import TopNav from '../components/topNavigation';

export default function Login() {
	return (
		<>  
            <TopNav/>
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
