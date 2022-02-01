import { getToken } from 'next-auth/jwt';
import { changeUsername } from '../../server/userFunctions';

const secret = "vqIWiGwReiDQzm2XxdECG+vg651K6/ip1EF/NHEVJs4";

export default async function submitUsername(req, res) {
	if (req.method === 'POST') {
		const token = await getToken({ req, secret });
		if (token) {
			// Signed in
			let userId = token.userId;
			let username = req.body.username.trim();
			let reqId = req.body.userId;

			//Ensure user is changing their own username
			if (userId !== reqId) {
				res.status(401).json({ error: 'Unauthorized' });
				return;
			}

			//Ensure username is not null or empty or malicious before submitting
			//https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
			if (username === '' || username === null || !RegExp(/^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).test(username)) {
				res.status(400).json({ error: 'Username is Invalid' });
				return;
			}

			//Change Username
			let result = await changeUsername(userId, username);
			res.status(200).json({ result: result });
		} else {
			// Not Signed in
			res.status(401).end('Not signed in');
		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
