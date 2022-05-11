import { getSession } from 'next-auth/react';
import { userEnabled } from '../../server/userFunctions';

export default async function getTimeLeft(req, res) {
	if (req.method === 'POST') {
		const session = await getSession({ req });
		if (session) {
			// Signed in
			let userId = session.user.id;

			//Ensure User is Enabled/Valid
			let enabled = await userEnabled(userId);
			if (enabled === false) {
				res.status(401).json({ error: 'User is not enabled' });
				return;
			} else if (enabled === null) {
				res.status(401).json({ error: 'User does not exist' });
				return;
			}

			//call runner
			const response = await fetch(
				`${process.env.RUNNER_SITE}/getUserStatus?userid=${session.user.id}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
				}
			);

			let result = await response.json();
			if (response.status === 200) {
				if (req.body.challengeHash === result.Challenge_Id)
					res.status(200).json({ timeLeft: result.Time_Left });
			} else {
				res.status(500).json({ error: 'Internal Server Error' });
			}
		} else {
			// Not Signed in
			res.status(401).end('Not signed in');
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
