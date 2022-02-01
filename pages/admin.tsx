import { useSession } from "next-auth/react";
import { getAllSubmissions } from "../server/challengeFunctions";
import { getAllLogs } from "../server/logging";
import styles from '../styles/admin.module.scss';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Row, Form, Button, Toast } from "react-bootstrap";
import Log from "../components/log";
import Link from "next/link";
import { useRouter } from "next/router";
import Unauthorized from "../components/unauthorized";

export default function Admin({ submissions, logs }) {
    const { data: session, status } = useSession();
    const [subLimit, setSubLimit] = useState(10);
    const [logLimit, setLogLimit] = useState(10);
    // TODO session is treated as a state: https://github.com/nextauthjs/next-auth/discussions/704
    // fix involves moving session checks to SSR
    if (session && session.user.role !== 'USER') return <Unauthorized />;

    const router = useRouter();
    const clearLogs = async () => {
        const response = await fetch('/api/deleteLogs', {
            method: 'POST'
        });
        if (response.status === 200) {
            router.replace(router.asPath);
        }
    };

    const userLink = (username) => {
        return <>
            <Link href={'users/' + username}>
                <a className="userLink">
                    {username}
                </a>
            </Link>
            <style jsx>
                {`
				.userLink{
					text-decoration: none;
				}
				`}
            </style>
        </>
    }

    return <>
        <h1>Admin Controls</h1>
        <br />
        <Row>
            <Col md={8}>
                <h2>Submission Logs</h2>
            </Col>
            <Col md={4} className={styles.displayFilter}>
                Showing Last
                <Form.Select size='sm' className={styles.mini} value={subLimit} onChange={(e) => { setSubLimit(parseInt(e.target.value)) }}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
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
                {submissions.map((submission, index) => index < subLimit &&
                    <tr key={index}>
                        <td>{dayjs(submission.added).format('DD MMM, HH:mm:ss')}</td>
                        <td>{userLink(submission.username)}</td>
                        <td>{submission.title}</td>
                        <td>{submission.flag}</td>
                        <td>{submission.correct === 1 ? "True" : "False"}</td>
                    </tr>
                )}
            </tbody>
        </table>
        <br />
        <Row>
            <Col md={2}>
                <h2>Exceptions</h2>
            </Col>
            <Col>
                <Button variant='danger' onClick={clearLogs}>Clear Exceptions</Button>
            </Col>
            <Col md={4} className={styles.displayFilter}>
                Showing Last
                <Form.Select size='sm' className={styles.mini} value={logLimit} onChange={(e) => { setLogLimit(parseInt(e.target.value)) }}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
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
                {logs.map((log, index) => index < logLimit &&
                    <Log style={styles.click} data={log} key=  {index}/>
                )}
            </tbody>
        </table>

        <br />

    </>;
}

export async function getServerSideProps(context) {
    const submissions = await getAllSubmissions();
    const logs = await getAllLogs();
    return {
        props: { submissions, logs },
    };
}