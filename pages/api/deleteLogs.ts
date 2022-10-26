import { getSession } from 'next-auth/react';
import { clearAllLogs } from '../../server/logging';

export default async function deleteLogs(req, res) {
    if (req.method === 'POST') {
        const session = await getSession({ req });

        if (session && session.user.role !== 'ADMIN') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        
        //Delete user
        let result = await clearAllLogs();
        res.status(200).json({ result: 'success' });;
        return;
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
}
