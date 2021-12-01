import prisma from './databaseFunctions';
import { logError } from './logging';

/**
 * Gets Challenges By Category Name
 * @param categoryName
 * @returns challenge object
 */
export async function getChallengeByCategory(categoryName) {
	try {
		const test = await prisma.challenges.findMany({
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
		return test;
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
export async function getChallengeByCTF(CTFName) {
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
 * @returns all challenges
 */
export async function getAllChallenges() {
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
 * Searches for Challenge by CTF Name and Category Name
 * @param CTFName
 * @param categoryName
 * @returns Challenge object
 */
export async function ChallengeSearch(CTFName, categoryName) {
	try {
		return await prisma.challenges.findMany({
			orderBy: [{ points: 'asc' }],
			where: {
				exposed: true,
				ctfName: {
					name: CTFName,
				},
				category: {
					name: categoryName,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
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
 * Get Challenge by ID
 * @param id 
 * @returns challenge object
 */
export async function getChallengeByID(id) {
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
 * Get all user submissions for challenge
 * @param userId 
 * @param challengeId 
 * @returns Submission object
 */
export async function getSubmissions(userId,challengeId) {
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

export async function getChallengeSolved(userId){
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
 * @returns correct/wrong flag submission
 */
export async function submitFlag(challenge, userId, flagSubmission, submission) {
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
			await ChallengeSolve(challenge);
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
 * @param challenge object
 */
async function ChallengeSolve(challenge) {
	try {
		await prisma.challenges.update({
			where: {
				id: challenge['id'],
			},
			data: {
				solves: challenge['solves'] + 1,
				points: process.env.DYNAMIC_SCORING === 'false' ? dynamicScoringFormula(challenge['solves'] + 1) : challenge['points'],
			},
		});
	} catch (err) {
		logError(err);
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Dynamic Scoring Formula
 * @param solves
 * @returns new Score
 */
function dynamicScoringFormula(solves) {
	let lb = parseInt(process.env.LOWER_BOUND);
	let ub = parseInt(process.env.UPPER_BOUND);
	let total = parseInt(process.env.TOTAL_PARTICIPANTS);
	let x = solves / total;
	let initial = parseInt(process.env.CHALLENGE_MAX_POINTS);
	let min = parseInt(process.env.CHALLENGE_MIN_POINTS);
	if (x <= lb) {
		return initial;
	} else if (x >= ub) {
		return min;
	} else {
		return initial - Math.ceil((initial - min) / (ub - lb)) * (x - lb);
	}
}
