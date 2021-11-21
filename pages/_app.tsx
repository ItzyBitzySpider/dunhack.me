import { AppProps } from 'next/app';
import '../styles/global.scss';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/layout';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionProvider>
	);
}
