import {
	getCsrfToken,
	getProviders,
	signIn,
	ClientSafeProvider,
	LiteralUnion,
	useSession,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { Card } from 'react-bootstrap';
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
				<Card>
					{Object.values(providers).map((provider) => (
						<>
							{provider.name === 'Email' && (
								<form method='post' action='/api/auth/signin/email'>
									<input
										name='csrfToken'
										type='hidden'
										defaultValue={csrfToken}
									/>
									<label>
										Email address
										<input type='email' id='email' name='email' />
									</label>
									<button type='submit'>Sign in with Email</button>
								</form>
							)}
							{provider.name !== 'Email' && (
								<div key={provider.name}>
									<button
										className={provider.name + 'button'}
										onClick={() => signIn(provider.id)}>
										Sign in with {provider.name}
									</button>
								</div>
							)}
						</>
					))}
				</Card>
				<style jsx>{``}</style>
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
