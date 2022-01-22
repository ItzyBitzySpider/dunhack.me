import { useSession } from "next-auth/react";

export default function Admin() {
    const { data: session, status } = useSession();
    if (session.user.id !== 'admin') return <h1>Unauthorized</h1>;
    return <>
        <h1>Admin Controls</h1>
        <br />
    </>;
}