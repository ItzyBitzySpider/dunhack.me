import { getSession } from 'next-auth/react';
import { deleteAccount } from '../../server/userFunctions';

export default async function deleteUser(req, res) {
	if (req.method === 'POST') {
		const session = await getSession({ req });
		if (session) {
			// Signed in
			let userId = session.user.id;
			let reqId = req.body.userId;

			//Ensure user is deleting their own account
			if (userId !== reqId) {
				res.status(401).json({ error: 'Unauthorized' });
				return;
			}

			//Delete user
			let result = await deleteAccount(userId);
			console.log('result is ');
			console.log(result);
			res.status(200).json({ result: result });
		} else {
			// Not Signed in
			res.status(401).end('Not signed in');
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
