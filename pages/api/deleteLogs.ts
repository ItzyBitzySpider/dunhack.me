import { getToken } from 'next-auth/jwt';
import { clearAllLogs } from '../../server/logging';

const secret = "vqIWiGwReiDQzm2XxdECG+vg651K6/ip1EF/NHEVJs4";

export default async function deleteLogs(req, res) {
    if (req.method === 'POST') {
        const token = await getToken({ req, secret });
        
        //TODO change to admin
        if (token && token.role !== 'USER') {
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
