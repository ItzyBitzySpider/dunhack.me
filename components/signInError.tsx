import { useState } from "react";
import { Toast } from "react-bootstrap";
import styles from '../styles/signIn.module.scss';

export default function SignInError({ error }) {
    const [show, setShow] = useState(true);
	const errors = {
		Signin: 'Try signing with a different account.',
		OAuthSignin: 'Try signing with a different account.',
		OAuthCallback: 'Try signing with a different account.',
		OAuthCreateAccount: 'Could not create account using the OAuth provider',
		EmailCreateAccount: 'Could not create account with the email provided',
		Callback: 'Try signing with a different account.',
		OAuthAccountNotLinked:
			'To confirm your identity, sign in with the same account you used originally.',
		EmailSignin: 'Invalid email address.',
		default: 'Unable to sign in.',
	};
	const errorMessage = error && (errors[error] ?? errors.default);
	return (
		<Toast className={styles.toast} onClose={() => setShow(false)} show={show} delay={3000} bg='danger' autohide>
			<Toast.Header className={styles.header} closeButton={false}>
				<h2>Error</h2>
			</Toast.Header>
			<Toast.Body className={styles.body}>{errorMessage}</Toast.Body>
		</Toast>
	);
}
