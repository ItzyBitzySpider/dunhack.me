import { useSession } from "next-auth/react";
import { getAllSubmissions } from "../server/challengeFunctions";
import styles from '../styles/admin.module.scss';
import dayjs from "dayjs";

export default function Admin({ logs }) {
    const { data: session, status } = useSession();

    // TODO session is treated as a state: https://github.com/nextauthjs/next-auth/discussions/704
    // fix involves moving sessin checks to SSR
    if (session && session.user.role !== 'USER') return <h1>Unauthorized</h1>;
    return <>
        <h1>Admin Controls</h1>
        <h2>Submission logs</h2>
        {/* TODO CSS */}
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th>Time Added</th>
                    <th>Correct</th>
                    <th>Flag</th>
                    <th>ChallengeId</th>
                    <th>UserId</th>
                    <th>Username</th>
                    <th>Challenge Title</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((submission, index) =>
                    <tr>
                        <td>{ dayjs(submission.added).format('DD MMM, HH:mm:ss')}</td>
                        <td>{submission.correct === 1 ? "True" : "False"}</td>
                        <td>{submission.flag}</td>
                        <td>{submission.challengeId}</td>
                        <td>{submission.userId}</td>
                        <td>{submission.username}</td>
                        <td>{submission.title}</td>
                    </tr>
                )}
            </tbody>
        </table>
        <br />

    </>;
}

export async function getServerSideProps(context) {
    const logs = await getAllSubmissions();
    // const logs = [{
    //     id: 1,
    //     added: 'date',
    //     correct: true,
    //     flag: 'asdf',
    //     challengeId: 'someid',
    //     userId: 'someuserid',
    //     username: 'Ocean',
    //     title: 'challenge title'
    // }]
    return {
        props: { logs },
    };
}