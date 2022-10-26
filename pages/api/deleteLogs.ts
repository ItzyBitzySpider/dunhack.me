import { unstable_getServerSession } from 'next-auth';
import { clearAllLogs } from '../../server/logging';
import { authOptions } from './auth/[...nextauth]';

export default async function deleteLogs(req, res) {
    if (req.method === 'POST') {
        const session = await unstable_getServerSession(req, res, authOptions);

        if (session && session.user.role !== 'ADMIN') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        
        //Delete user
        const result = await clearAllLogs();
        res.status(200).json({ result: 'success' });;
        return;
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }
}
