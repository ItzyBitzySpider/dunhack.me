import { getToken } from 'next-auth/jwt';
import { deleteAccount } from '../../server/userFunctions';

const secret = "vqIWiGwReiDQzm2XxdECG+vg651K6/ip1EF/NHEVJs4";

export default async function deleteUser(req, res) {
	if (req.method === 'POST') {
		const token = await getToken({ req, secret });
		if (token) {
			// Signed in
			let userId = token.userId;
			let reqId = req.body.userId;

			//Ensure user is deleting their own account
			if (userId !== reqId) {
				res.status(401).json({ error: 'Unauthorized' });
				return;
			}

			//Delete user
			let result = await deleteAccount(userId);
			res.status(200).json({ result: result });
		} else {
			// Not Signed in
			res.status(401).end('Not signed in');
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
