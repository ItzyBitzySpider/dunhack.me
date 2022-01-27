import { submissions } from '@prisma/client';
import { challengeDetails, challengesByCategory, solvedChallenge, challenge_type, lastSubmission, singleSubmission, Submission} from '../types/custom';
import prisma from './databaseFunctions';
import { logError } from './logging';
import { getTotalEligibleUsers } from './userFunctions';

/**
 * Gets Challenges By Category Name
 * @param categoryName
 * @returns challenge object
 */
export async function getChallengeByCategory(categoryName: string): Promise<challenge_type | null> {
	try {
		return await prisma.challenges.findMany({
			orderBy: [
				{
					ctfName: {
						name: 'asc',
					},
				},
				{ points: 'asc' },
			],
			where: {
				exposed: true,
				category: {
					name: categoryName,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
				hash: true,
				service: true,
				ctfName: {
					select: {
						name: true,
					},
				},
				category: {
					select: {
						name: true,
					},
				},
				hints: {
					select: {
						body: true,
					},
				},
				files: {
					select: {
						title: true,
						url: true,
					},
				},
				points: true,
				solves: true,
			},
		});
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Gets Challenges by CTF Name
 * @param CTFName
 * @returns challenge object
 */
export async function getChallengeByCTF(CTFName: string): Promise<challenge_type | null> {
	try {
		return await prisma.challenges.findMany({
			orderBy: [
				{
					category: {
						name: 'asc',
					},
				},
				{ points: 'asc' },
			],
			where: {
				exposed: true,
				ctfName: {
					name: CTFName,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
				hash: true,
				service: true,
				ctfName: {
					select: {
						name: true,
					},
				},
				category: {
					select: {
						name: true,
					},
				},
				hints: {
					select: {
						body: true,
					},
				},
				files: {
					select: {
						title: true,
						url: true,
					},
				},
				points: true,
				solves: true,
			},
		});
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Gets All Challenges
 * @returns challegnesByCategory Object
 */
export async function getAllChallenges(): Promise<Array<challengesByCategory>> {
	let categories = await prisma.category.findMany({
		select: {
			name: true,
		},
	});
	let challenges = [];
	for (const category of categories) {
		const obj = {};
		obj['name'] = category['name'];
		obj['challenges'] = await getChallengeByCategory(String(category['name']));
		challenges.push(obj);
	}
	return challenges;
}


/**
 * Get Challenge Details by ID (For Solving)
 * @param id 
 * @returns challenge object
 */
export async function getChallengeById(id: number): Promise<challengeDetails | null> {
	try {
		return await prisma.challenges.findFirst({
			where: {
				id: id,
				exposed: true,
			},
			select: {
				id: true,
				flag: true,
				min_seconds_btwn_submissions: true,
				case_insensitive: true,
				points: true,
				minPoints: true,
				initialPoints: true,
				dynamicScoring: true,
				solves: true,
			},
		});
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Get Last User Submission for Challenge
 * @param userId 
 * @param challengeId 
 * @returns lastSubmission object
 */
export async function getLastSubmission(userId: string,challengeId: number): Promise<lastSubmission | null> {
	try {
		return await prisma.submissions.findFirst({
			where: {
				userId: userId,
				challengeId: challengeId,
			},
			select: {
				id: true,
				added: true,
				correct: true,
			},
		});
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Get Submission by Submission ID
 * @param submissionId 
 * @returns singleSubmission Object
 */
export async function getSubmissionById(submissionId: number): Promise<singleSubmission | null> {
	try {
		return await prisma.submissions.findFirst({
			where: {
				id: submissionId,
			},
			select: {
				id: true,
				added: true,
				challengeId: true,
				userId: true,
				flag: true,
				correct: true,
			},
		});
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Gets All Submissions for a User
 * @returns Submission Object
 */
export async function getAllSubmissions(): Promise<Array<Submission>> {
	try {
		return await prisma.$queryRaw`
			SELECT
				submissions.id,
				submissions.added,
				submissions.correct,
				submissions.flag,
				submissions.challengeId,
				submissions.userId,
				user.username,
				challenges.title
			FROM submissions
			INNER JOIN user ON submissions.userId = users.id
			INNER JOIN challenges ON submissions.challengeId = challenges.id
			ORDER BY submissions.added DESC
		`;
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}


/**
 * Gets all Challenges solved by user
 * @param userId 
 * @returns Challenges object
 */
export async function getChallengesSolved(userId: string): Promise<Array<solvedChallenge> | null> {
	try {
		return await prisma.$queryRaw`
		SELECT
           s.added,
           ((SELECT COUNT(*) FROM submissions AS ss WHERE ss.correct = 1 AND ss.added < s.added AND ss.challengeId=s.challengeId)+1) AS pos,
           ch.id AS challengeId,
           ch.title,
           ch.points,
           ca.name AS categoryName
        FROM submissions AS s
        LEFT JOIN challenges AS ch ON ch.id = s.challengeId
        LEFT JOIN category AS ca ON ca.id = ch.categoryId
        WHERE
           s.correct = true AND
           s.userId = ${userId} AND
           ch.exposed = 1
        ORDER BY s.added DESC;
		`;
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Submits Flag, Creates new record in Submissions, returns submission status
 * @param challenge
 * @param userId
 * @param flagSubmission
 * @param Submission
 * @returns Flag Correct/Wrong
 */
export async function submitFlag(challenge: object, userId: string, flagSubmission: string, submission: object): Promise<boolean | null> {
	try {
		//mark flag
		let correct = false;
		if (challenge['case_insensitive']) {
			correct = challenge['flag'].toUpperCase() === flagSubmission.toUpperCase();
		} else {
			correct = challenge['flag'] === flagSubmission;
		}
		if (submission === null) {
			await prisma.submissions.create({
				data: {
					added: new Date(),
					challengeId: challenge['id'],
					userId: userId,
					flag: flagSubmission,
					correct: correct,
				},
			});
		} else {
			await prisma.submissions.update({
				where: {
					id: submission['id'],
				},
				data: {
					added: new Date(),
					flag: flagSubmission,
					correct: correct,
				},
			});
		}
		if (correct) {
			let succeed = await ChallengeSolve(challenge);
			if (!succeed) throw new Error('Challenge solve failed');
		}
		return correct;
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Updates Challenge Solve and Points
 * @param challenge
 * @returns Function Execution Status
 */ 
async function ChallengeSolve(challenge: object): Promise<boolean> {
	try {
		await prisma.challenges.update({
			where: {
				id: challenge['id'],
			},
			data: {
				solves: challenge['solves'] + 1,
				points: challenge['dynamicScoring'] ? await dynamicScoringFormula(challenge, challenge['solves'] + 1) : challenge['points'],
			},
		});
		return true
	} catch (err) {
		logError(err);
		return false;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Unsolves a Challenge, Updates Challenge Solve and Points
 * @param challenge 
 * @returns Function Execution Status
 */
 async function ChallengeUnsolve(challenge: object): Promise<boolean> {
	try {
		await prisma.challenges.update({
			where: {
				id: challenge['id'],
			},
			data: {
				solves: challenge['solves'] - 1,
				points: challenge['dynamicScoring'] ? await dynamicScoringFormula(challenge, challenge['solves'] - 1) : challenge['points'],
			},
		});
		return true
	} catch (err) {
		logError(err);
		return false;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Dynamic Scoring Formula
 * @param Challenge 
 * @param solves
 * @returns new Score
 */
async function dynamicScoringFormula(challenge: object, solves: number): Promise<number> {
	let lb = parseInt(process.env.LOWER_BOUND);
	let ub = parseInt(process.env.UPPER_BOUND);
	let total = await getTotalEligibleUsers();
	let x = solves / total;
	let initial = challenge['initialPoints'];
	let min = challenge['minPoints'];
	if (x <= lb) {
		return initial;
	} else if (x >= ub) {
		return min;
	} else {
		return initial - Math.ceil((initial - min) / (ub - lb)) * (x - lb);
	}
}

/**
 * Admin Panel Manual Marking of Submissions
 * @param submissionId 
 * @param correct 
 * @returns Function Execution Status
 */
export async function markSubmission(submissionId: number, correct: boolean): Promise<boolean> {
	try {
		let submission = await getSubmissionById(submissionId);
		if (submission === null) throw new Error('Submission not found');

		await prisma.submissions.update({
			where: {
				id: submissionId,
			},
			data: {
				correct: correct,
			},
		});

		let challenge = await getChallengeById(submission['challengeId']);

		if (correct) {
			let succeed = await ChallengeSolve(challenge);
			if (!succeed) throw new Error('Challenge solve failed');
		} else {
			let succeed = await ChallengeUnsolve(challenge);
			if (!succeed) throw new Error('Challenge unsolve failed');
		}

		return true;
	} catch (err) {
		logError(err);
		return false;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

