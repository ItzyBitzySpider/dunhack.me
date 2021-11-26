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
import {FcGoogle} from 'react-icons/fc';
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
			<Row className='justify-content-center align-items-center h-100 g-0'>
				<Col lg={6}>
					<h1>Sign in with</h1>
					<h6>Email login requires manual verification. Please register for an account here. </h6>
					<br />
					<Form method='post' action='/api/auth/signin/email'>
						<Row className='g-0'>
							<Col md={10} className='h-100 g-0'>
								<Form.Group controlId='csrfToken'>
									<Form.Control
										name='csrfToken'
										type='hidden'
										defaultValue={csrfToken}
									/>
								</Form.Group>

								<FloatingLabel className={styles.inputField} label='Email address' controlId='email'>
									<Form.Control										
										name='email'
										type='email'
										placeholder='Email Address'
									/>
								</FloatingLabel>
							</Col>
				
							<Col md={2}>
								<Button
									className={styles.submit}
									variant='secondary'
									type='submit'>
									<MdKeyboardArrowRight size='2rem' />
								</Button>
							</Col>
						</Row>
					</Form>
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
					<Row className='justify-content-center g-0'>
						<Button
							className={styles.btnGithub}
							onClick={() => signIn('github')}>
							<GoMarkGithub size='1.2rem' className={styles.providerIcon} />
							Sign in with GitHub
						</Button>
					</Row>
					<br/>
					<Row className='justify-content-center g-0'>
						<Button
							className={styles.btnGoogle}
							onClick={() => signIn('google')}>
							<FcGoogle size='1.2rem' className={styles.providerIcon} />
							Sign in with Google
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
