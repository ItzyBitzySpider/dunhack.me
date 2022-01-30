import { useSession } from "next-auth/react";
import { getAllSubmissions } from "../server/challengeFunctions";
import { getAllLogs } from "../server/logging";
import styles from '../styles/admin.module.scss';
import dayjs from "dayjs";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Log from "../components/log";

export default function Admin({ submissions, logs }) {
    const { data: session, status } = useSession();
    const [subLimit, setSubLimit] = useState(10);
    const [logLimit, setLogLimit] = useState(10);
    const [show, setShow] = useState(false);

    // TODO session is treated as a state: https://github.com/nextauthjs/next-auth/discussions/704
    // fix involves moving session checks to SSR
    if (session && session.user.role !== 'USER') return <h1>Unauthorized</h1>;
    return <>
        <h1>Admin Controls</h1>
        <br />
        <h2>Submission logs</h2>
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
                    <tr>
                        <td>{dayjs(submission.added).format('DD MMM, HH:mm:ss')}</td>
                        <td>{submission.username}</td>
                        <td>{submission.title}</td>
                        <td>{submission.flag}</td>
                        <td>{submission.correct === 1 ? "True" : "False"}</td>
                    </tr>
                )}
            </tbody>
        </table>
        <br/>
        <h2>Exceptions</h2>
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
                {logs.map((log, index) => index < subLimit &&
                    <Log style={styles.click} data={log}/>
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