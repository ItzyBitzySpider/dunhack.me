import { useSession } from "next-auth/react";
import { getAllSubmissions } from "../server/challengeFunctions";

export default function Admin({ logs }) {
    const { data: session, status } = useSession();

    // TODO session is treated as a state: https://github.com/nextauthjs/next-auth/discussions/704
    // fix involves moving sessin checks to SSR
    if (session && session.user.role !== 'USER') return <h1>Unauthorized</h1>;
    return <>
        <h1>Admin Controls</h1>
        <h2>Submission logs</h2>
        // TODO CSS
        <table>
            {logs.map((submission, index) =>
                <tr>
                    <td>{submission.id}</td>
				    <td>{submission.added}</td>
				    <td>{submission.correct}</td>
				    <td>{submission.flag}</td>
				    <td>{submission.challengeId}</td>
				    <td>{submission.userId}</td>
				    <td>{submission.username}</td>
				    <td>{submission.title}</td>
                </tr>
            )}
        </table>
        <br />

    </>;
}

export async function getServerSideProps(context) {
    // const logs = await getAllSubmissions();
    const logs = [{
        id: 1,
        added: 'date',
        correct: true,
        flag: 'asdf',
        challengeId: 'someid',
        userId: 'someuserid',
        username: 'Ocean',
        title: 'challenge title'
    }]
    
    return {
        props: { logs },
    };
}