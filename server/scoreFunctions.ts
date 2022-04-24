import { userRanking } from "../types/custom";
import prisma from "./databaseFunctions";
import { logError } from "./logging";

/**
 * Gets Scores of all Users and sorts by score and tiebreaker (time)
 * @returns scoreboard object
 */
export async function getScoreboard(): Promise<Array<userRanking> | null> {
	try {
		//raw query since Prisma currently cannot handle such quries
        let scores = await prisma.$queryRaw`
        SELECT 
            u.id AS user_id, 
            u.username, 
            SUM(c.points) AS score, 
            MAX(s.added) AS lastCorrectSubmission 
        FROM "User" AS u
        LEFT JOIN submissions AS s ON u.id = s."userId" AND s.correct = true
        LEFT JOIN challenges AS c ON c.id = s."challengeId"
        WHERE 
            u.enabled = true
        GROUP BY u.id
        ORDER BY score DESC, lastCorrectSubmission ASC;
        `;
        let scoreboard = [];
        for (let i = 0; i < scores.length; i++) {
            const obj = {};
            obj['position'] = i + 1;
            obj['username'] = scores[i].username;
            obj['score'] = parseInt(scores[i].score? scores[i].score : 0);
            scoreboard.push(obj);
        }
        return scoreboard;
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

export async function getUserScore(userId: string): Promise<number | null> {
	try {
		//raw query since Prisma currently cannot handle such quries
        let score = await prisma.$queryRaw`
        SELECT 
            SUM(c.points) AS score
        FROM "User" AS u
        LEFT JOIN submissions AS s ON u.id = s."userId" AND s.correct = true
        LEFT JOIN challenges AS c ON c.id = s."challengeId"
        WHERE 
            u.id = ${userId}
        `;
        return score[0]['score'] ? parseInt(score[0]['score']) : 0;
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}
