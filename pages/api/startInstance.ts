import { unstable_getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { validateChallengeHash } from '../../server/challengeFunctions';
import { userEnabled } from '../../server/userFunctions';

export default async function startInstance(req, res) {
	if (req.method === 'POST') {
		const session = await unstable_getServerSession(req, res, authOptions);
		if (session) {
			// Signed in
			let userId = session.user.id;
			let challengeHash = req.body.challengeHash;

			//Ensure Challenge is Valid
			let challenge = await validateChallengeHash(challengeHash);
			if (challenge === false) {
				res.status(400).json({ error: 'Challenge does not exist' });
				return;
			}

			//Ensure User is Enabled/Valid
			let enabled = await userEnabled(userId);
			if (enabled === false) {
				res.status(400).json({ error: 'User is not enabled' });
				return;
			} else if (enabled === null) {
				res.status(400).json({ error: 'User does not exist' });
				return;
			}
			//call runner
			let response = await fetch(
				`${process.env.RUNNER_SITE}/addInstance?userid=${userId}&challid=${challengeHash}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
				}
			);
			let json = await response.json();
			if (json.Error) {
				res.status(400).json({ error: json.Error });
			} else {
				res.status(200).json(json);
			}
		} else {
			// Not Signed in
			res.status(401).end('Not signed in');
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
