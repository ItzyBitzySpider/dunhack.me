import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
// import Link from 'next/Link';

export default function TopNav() {
	return (
		<>
			<Navbar bg='dark' variant='dark'>
				<Container>
					<Nav className='me-auto'>
						<Navbar.Brand href='/'>It'z Different</Navbar.Brand>
						{/* TODO Change Nav.Link to NextJS Link components for better site performance */}
						<Nav.Link href='/'>Home</Nav.Link>
						<Nav.Link href='challenges'>Challenges</Nav.Link>
						<Nav.Link href='scoreboard'>Scoreboard</Nav.Link>
						{/* TODO: Render different buttons depending on user login state */}
						<Nav.Link href='login'>Login</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
}
