import { getSession } from "next-auth/react"
import { changeUsername } from "../../server/userFunctions";

export default async function submitUsername(req, res) {
	if (req.method === 'POST') {
		const session = await getSession({ req })
  		if (session) {
    		// Signed in
			console.log(session.user.id);
			let userId = session.user.id;
			let username = req.body.username.trim();
		
			//Ensure flag is not null or empty before submitting
			if (username === '' || username === null) {
				res.status(400).json({ error: 'Username cannot be empty' });
				return;
			}

			//Change Username
			let result = await changeUsername(userId, username);
			console.log('result is ')
			console.log(result);
			res.status(200).json({ result: result });
  		} else {
    		// Not Signed in
    		res.status(401).end('Not signed in')
  		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
