import { getSession } from "next-auth/react"
import { userEnabled } from "../../server/userFunctions";

export default async function getInstanceStatus(req, res) {
	if (req.method === 'POST') {
		const session = await getSession({ req })
  		if (session) {
    		// Signed in
			let userId = session.user.id;
            
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
            let response = await fetch(`${process.env.RUNNER_SITE}/getUserStatus?userid=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            let json = await response.json();
            res.status(200).json(json);
  		} else {
    		// Not Signed in
    		res.status(401).end('Not signed in')
  		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
