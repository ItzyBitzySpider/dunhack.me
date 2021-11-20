import { AppProps } from 'next/app';
import '../styles/global.scss';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
}
