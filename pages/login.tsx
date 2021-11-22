import {
	getCsrfToken,
	getProviders,
	signIn,
	ClientSafeProvider,
	LiteralUnion,
	useSession,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { Button, Card, FormGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';

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
			<>
				{Object.values(providers).map((provider) => (
					<>
						{provider.name === 'Email' && (
							<form
								className='login-form'
								method='post'
								action='/api/auth/signin/email'>
								<input
									name='csrfToken'
									type='hidden'
									defaultValue={csrfToken}
								/>
								<FormGroup>
									<label>Email address</label>
									<input
										type='email'
										id='email'
										name='email'
										placeholder='Email Address'
									/>
								</FormGroup>
								<Button variant='secondary' type='submit'>
									Sign in with Email
								</Button>
							</form>
						)}
						{provider.name !== 'Email' && (
							<div key={provider.name}>
								<Button
									className={'btn-' + provider.name}
									onClick={() => signIn(provider.id)}>
									Sign in with {provider.name}
								</Button>
							</div>
						)}
					</>
				))}
				<style>{`
					.login-form{
						display:block;
						// margin-top: 10%;
					}
				`}</style>
			</>
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
