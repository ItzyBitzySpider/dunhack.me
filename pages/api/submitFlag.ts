import { submitFlag } from '../../server/challengeFunctions';

export default function handler(req, res) {
	if (req.method === 'POST') {
		const result = submitFlag(req.challengeId, req.userId, req.flag);
		res.status(200).json({ result: result });
	} else {
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
