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
 * Submits Flag, Creates new record in Submissions, returns status of function
 * @param challengeId
 * @param userId
 * @param flagSubmission
 * @returns status of DB Update
 */
export async function submitFlag(
	challengeId: Number,
	userId: String,
	flagSubmission: String
) {
	try {
		//@ts-ignore
		let challenge = await prisma.challenges.findOne({
			where: {
				id: challengeId,
			},
			select: {
				solves: true,
				flag: true,
				points: true,
				case_insensitive: true,
			},
		});
		if (challenge['case_insensitive']) {
			challenge['correct'] = Boolean(
				challenge['flag'].localeCompare(flagSubmission)
			);
		} else {
			challenge['correct'] = challenge['flag'] === flagSubmission;
		}
		await prisma.submissions.create({
			data: {
				added: new Date(),
				challengeId: challengeId,
				userId: userId,
				flag: flagSubmission,
				correct: challenge['correct'],
			},
		});
		if (challenge['correct'] === true) {
			await ChallengeSolve(challenge);
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
