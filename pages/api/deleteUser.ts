import { unstable_getServerSession } from 'next-auth';
import { deleteAccount } from '../../server/userFunctions';
import { authOptions } from './auth/[...nextauth]';

export default async function deleteUser(req, res) {
  if (req.method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions);
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
      await res.revalidate(`/users/${session.user.username}/`)
      await res.revalidate('/scoreboard/')
      res.status(200).json({ result: result });
    } else {
      // Not Signed in
      res.status(401).end('Not signed in');
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
