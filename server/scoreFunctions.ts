import prisma from "./databaseFunctions";
import { logError } from "./logging";

export async function getScoreboard() {
	try {
		//raw query since Prisma currently cannot handle such quries
        return await prisma.$queryRaw`
        SELECT 
            u.id AS user_id, 
            u.name, 
            SUM(c.points) AS score, 
            MAX(s.added) AS lastCorrectSubmission 
        FROM User AS u
        LEFT JOIN submissions AS s ON u.id = s.userId AND s.correct = true
        LEFT JOIN challenges AS c ON c.id = s.challengeId
        WHERE 
            u.competing = true
        GROUP BY u.id
        ORDER BY score DESC, lastCorrectSubmission ASC;
        `;
	} catch (err) {
		logError(err);
        console.log(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}
