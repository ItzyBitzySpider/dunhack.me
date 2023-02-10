import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
} from 'next-auth/react';
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  Container,
  Row,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GoMarkGithub } from 'react-icons/go';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';
import styles from '../styles/login.module.scss';
import SignInError from '../components/signInError';
import { useState } from 'react';

export default function Login({ csrfToken }: { csrfToken: string }) {
  const { error } = useRouter().query;
  const [ email, setEmail ] = useState('');
  const [ disabled, setDisabled ] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session) {
    router.push('profile');
    return <a>Redirecting</a>;
} else {
    return (
      <>
	<Row className='justify-content-center align-items-center h-100 g-0'>
	{error && <SignInError error={error} />}
	  <Col lg={6}>
	    <h1>Sign in with</h1>
	    <h6>
	      Email login requires manual verification. Please contact admin to register for an account.
	    </h6>
	    <br />
	    <Form>
	      <Row className='g-0'>
		<Col md={10} className='h-100 g-0'>
		  <Form.Group controlId='csrfToken'>
		    <Form.Control
		      name='csrfToken'
		      type='hidden'
		      defaultValue={csrfToken}
		    />
		  </Form.Group>

		  <FloatingLabel
		    className={styles.inputField}
		    label='Email address'
		    controlId='email'>
		    <Form.Control
		      name='email'
		      type='email'
		      placeholder='Email Address'
		      onChange={e => setEmail(e.target.value)}
		    />
		  </FloatingLabel>
		</Col>

		<Col md={2}>
		  <Button
		    className={styles.submit}
		    variant='secondary'
		    type='submit'
		    onClick={e => {
		      e.preventDefault();
		      signIn("email", { email });
		      // Uncomment if u want to ratelimit by only allowing clicking the button once
		      // setDisabled(true);
		    }}
		    >
		    Submit
		  </Button>
		</Col>
	      </Row>
	    </Form>
	    <br />
	    <Row className='justify-content-center'>
	      <span> &nbsp; &nbsp; &nbsp; Or&nbsp; &nbsp; &nbsp; </span>
	      <style>
		{`span{
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
		}`}
	      </style>
	    </Row>
	    <br />
	    <Row className='justify-content-center g-0'>
	      <Button
		className={styles.btnGithub}
		onClick={() => signIn('github')}>
		<GoMarkGithub size='1.2rem' className={styles.providerIcon} />
		Sign in with GitHub
	      </Button>
	    </Row>{' '}
	    <br />
	    <Row className='justify-content-center g-0'>
	      <Button
		className={styles.btnDiscord}
		onClick={() => signIn('discord')}>
		<FaDiscord size='1.2rem' className={styles.providerIcon} />
		Sign in with Discord
	      </Button>
	    </Row>
	    <br />
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
