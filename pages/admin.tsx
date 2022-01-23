import { useSession } from "next-auth/react";

export default function Admin({ logs }) {
    const { data: session, status } = useSession();
    if (session.user.role !== 'Admin') return <h1>Unauthorized</h1>;
    return <>
        <h1>Admin Controls</h1>
        <br />
        
    </>;
}

export async function getServerSideProps(context) {
    const logs = await getLogs();
    return {
        props: { logs },
    };
}

//implement in server functions later
function getLogs() {
    throw new Error("Function not implemented.");
}

