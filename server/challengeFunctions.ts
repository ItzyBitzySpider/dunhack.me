import prisma from './databaseFunctions';
import { logError } from './logging';

/**
 * Gets Challenges By Category Name
 * @param categoryName
 * @returns challenge object
 */
export async function getChallengeByCategory(categoryName) {
	try {
		//@ts-ignore
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
					//@ts-ignore
					name: categoryName,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
				//@ts-ignore
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
						size: true,
						md5: true,
						downloadKey: true,
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
		//@ts-ignore
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
					//@ts-ignore
					name: CTFName,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
				//@ts-ignore
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
						size: true,
						md5: true,
						downloadKey: true,
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
		//@ts-ignore
		return await prisma.challenges.findMany({
			orderBy: [{ points: 'asc' }],
			where: {
				exposed: true,
				ctfName: {
					//@ts-ignore
					name: CTFName,
				},
				category: {
					//@ts-ignore
					name: categoryName,
				},
			},
			select: {
				id: true,
				title: true,
				description: true,
				//@ts-ignore
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
						size: true,
						md5: true,
						downloadKey: true,
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
		//@ts-ignore
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
		//@ts-ignore
		return await prisma.submissions.findFirst({
			where: {
				userId: userId,
				challengeId: challengeId,
			},
			select: {
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
 * Submits Flag, Creates new record in Submissions, returns submission status
 * @param challenge
 * @param userId
 * @param flagSubmission
 * @param firstTime
 * @returns correct/wrong flag submission
 */
export async function submitFlag(challenge, userId, flagSubmission, firstTime) {
	try {
		//mark flag
		let correct = false;
		if (challenge['case_insensitive']) {
			correct = challenge['flag'].toUpperCase() === flagSubmission.toUpperCase();
		} else {
			correct = challenge['flag'] === flagSubmission;
		}
		if (firstTime) {
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
					userId: userId,
					challengeId: challenge['id'],
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
				points: dynamicScoringFormula(challenge['solves'] + 1),
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
