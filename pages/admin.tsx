import { useSession } from 'next-auth/react';
import { getAllSubmissions } from '../server/challengeFunctions';
import { getAllLogs } from '../server/logging';
import styles from '../styles/admin.module.scss';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Log from '../components/log';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function Admin({ submissions, logs }) {
  const { data: session, status } = useSession();
  const [subLimit, setSubLimit] = useState(10);
  const [logLimit, setLogLimit] = useState(10);

  const router = useRouter();
  const clearLogs = async () => {
    const response = await fetch('/api/deleteLogs', {
      method: 'POST',
    });
    if (response.status === 200) {
      router.replace(router.asPath);
    }
  };

  const userLink = (username) => {
    return (
      <>
        <Link className='userLink' href={'users/' + username}>
          {username}
        </Link>
        <style jsx>
          {`
						.userLink {
							text-decoration: none;
						}
					`}
        </style>
      </>
    );
  };

  return (
    <>
      <h1>Admin Controls</h1>
      <br />
      <Row>
        <Col md={8}>
          <h2>Submission Logs</h2>
        </Col>
        <Col md={4} className={styles.displayFilter}>
          Showing Last
          <Form.Select
            size='sm'
            className={styles.mini}
            value={subLimit}
            onChange={(e) => {
              setSubLimit(parseInt(e.target.value));
            }}>
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='40'>40</option>
            <option value='50'>50</option>
          </Form.Select>
        </Col>
      </Row>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Username</th>
            <th>Challenge Title</th>
            <th>Flag Submitted</th>
            <th>Correct</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(
            (submission, index) =>
              index < subLimit && (
                <tr key={index}>
                  <td>{dayjs(submission.added).format('DD MMM, HH:mm:ss')}</td>
                  <td>{userLink(submission.username)}</td>
                  <td>{submission.title}</td>
                  <td>{submission.flag}</td>
                  <td>{submission.correct === true ? 'True' : 'False'}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
      <br />
      <Row>
        <Col md={2}>
          <h2>Exceptions</h2>
        </Col>
        <Col>
          <Button variant='danger' onClick={clearLogs}>
            Clear Exceptions
          </Button>
        </Col>
        <Col md={4} className={styles.displayFilter}>
          Showing Last
          <Form.Select
            size='sm'
            className={styles.mini}
            value={logLimit}
            onChange={(e) => {
              setLogLimit(parseInt(e.target.value));
            }}>
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='40'>40</option>
            <option value='50'>50</option>
          </Form.Select>
        </Col>
      </Row>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Time Added</th>
            <th>Code</th>
            <th>Message</th>
            <th>Trace</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(
            (log, index) =>
              index < logLimit && (
                <Log style={styles.click} data={log} key={index} />
              )
          )}
        </tbody>
      </table>

      <br />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  if (session?.user.role !== "ADMIN") return { notFound: true };
  let submissions = await getAllSubmissions();
  if (!submissions) submissions = [];
  let logs = await getAllLogs();
  if (!logs) logs = [];

  return {
    props: { submissions, logs },
  };
}
