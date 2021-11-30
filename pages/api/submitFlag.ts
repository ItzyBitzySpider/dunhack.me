import { getSession } from "next-auth/react"
import { getChallengeByID, getSubmissions, submitFlag } from '../../server/challengeFunctions';
import { validateId } from "../../server/util";

export default async function submit(req, res) {
	if (req.method === 'POST') {
		const session = await getSession({ req })
  		if (session) {
    		// Signed in
			let userId = session.userId;
			let challengeId = req.body.challengeId;
			let flag = req.body.flag.trim();
			//validate Challenge ID
			validateId(challengeId);
			
			//time between submissions check
			let latestSubmission = 0;
			let submission = await getSubmissions(userId, challengeId);
			if (submission !== null) {
				latestSubmission = submission["added"];
				if (submission["correct"]){
					res.status(400).json({ error: 'You may only submit a correct flag once' });
					return;
				}
			}

			let challenge = await getChallengeByID(challengeId);
			if (challenge === null) {
				res.status(400).json({ error: 'Challenge does not exist' });
				return;
			}
			let secondsSinceSubmission = new Date().getTime() - latestSubmission;
			if (secondsSinceSubmission < challenge["min_seconds_btwn_submissions"]) {
				res.status(400).json({ error: 'You must wait ' + (challenge["min_seconds_btwn_submissions"] - secondsSinceSubmission) + ' seconds before submitting again' });
				return;
			}

			//Ensure flag is not null or empty before submitting
			if (flag === '' || flag === null) {
				res.status(400).json({ error: 'Flag cannot be empty' });
				return;
			}

			//Submit Flag
			let result = await submitFlag(challenge, userId, flag, submission);
			res.status(200).json({ result: result });
  		} else {
    		// Not Signed in
    		res.status(401).end('Not signed in')
  		}
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
