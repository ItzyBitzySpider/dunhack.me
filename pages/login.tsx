import {
	getCsrfToken,
	getProviders,
	signIn,
	ClientSafeProvider,
	LiteralUnion,
	useSession,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import {
	Button,
	Row,
	Col,
	FloatingLabel,
	Form,
	Container,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GoMarkGithub, GoLogoGithub } from 'react-icons/go';
import styles from '../styles/login.module.scss';

export default function Login({
	providers,
	csrfToken,
}: {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	>;
	csrfToken: string;
}) {
	const { data: session, status } = useSession();
	if (session) {
		const router = useRouter();
		router.push('profile');
		return <a>Redirecting</a>;
	} else {
		return (
			<Row className='justify-content-center align-items-center h-100'>
				<Col md={6}>
					<h1>Sign in with</h1> 
					<br/>
					<Row>
						<Form method='post' action='/api/auth/signin/email' id='test'>
							<Row className='align-items-center justify-content-center'>
								<Col md={10} className='h-100 g-0'>
									<Form.Group controlId='csrfToken'>
										<Form.Control
											name='csrfToken'
											type='hidden'
											defaultValue={csrfToken}
										/>
									</Form.Group>

									<FloatingLabel label='Email address' controlId='email'>
										<Form.Control
											className={styles.inputField}
											name='email'
											type='email'
											placeholder='Email Address'
										/>
									</FloatingLabel>
								</Col>
								<Col className='h-100'>
									<Button className='h-100' variant='secondary' type='submit'>
										<MdKeyboardArrowRight size='1.5rem' />
									</Button>
								</Col>
							</Row>
						</Form>
					</Row>
					<br />
					<Row className='justify-content-center'>
						<span> &nbsp;&nbsp;&nbsp;Or&nbsp;&nbsp;&nbsp; </span>
						
						<style>{`
						span{
							display: flex;
							flex-direction: row;
							color: #aaa;
							font-size: 1rem;
						}
						span:before,
						span:after {
							content: "";
							flex: 1 1;
							border-bottom: 2px solid #aaa;
							margin: auto;
						}
						`}</style>
					</Row>
					<br />
					<Row className='justify-content-center'>
						<Button
							className={styles.btnGithub}
							onClick={() => signIn(providers.github.id)}>
							<GoMarkGithub size='1.3rem' className={styles.providerIcon} />
							<GoLogoGithub size='4rem' />
						</Button>
					</Row>
				</Col>
			</Row>
		);
	}
}

// Get Auth providers
export async function getServerSideProps(context) {
	const providers = await getProviders();
	const csrfToken = await getCsrfToken(context);
	return {
		props: { providers, csrfToken },
	};
}
