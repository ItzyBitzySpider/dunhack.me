import { PrismaClient } from "@prisma/client"

let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}

export default prisma

export async function getChallengeByCategory(categoryName) {
    try {
        //@ts-ignore
        return await prisma.challenges.findMany({
            orderBy: [
                {
                    ctfName: {
                        name: 'asc',
                    }
                },
                {points: 'asc',},
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
            }
        }); 
    }
    catch (err) {
        console.log(err);
        return null;
    }
    finally{
        async () => {
            await prisma.$disconnect();
        }
    }
}

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
                {points: 'asc',},
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
            }
        }); 
    }
    catch (err) {
        console.log(err);
        return null;
    }
    finally{
        async () => {
            await prisma.$disconnect();
        }
    }
}

export async function getAllChallenges() {
    try {
        //@ts-ignore
        return await prisma.challenges.findMany({
            orderBy: [
                {
                    category: {
                        name: 'asc',
                    },
                },
                {
                    ctfName: {
                        name: 'asc',
                    }
                },
                {points: 'asc',},
            ],
            where: {
                exposed: true,
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
            }
        }); 
    }
    catch (err) {
        console.log(err);
        return null;
    }
    finally{
        async () => {
            await prisma.$disconnect();
        }
    }
}

export async function ChallengeSearch(CTFName, categoryName) {
    try {
        //@ts-ignore
        return await prisma.challenges.findMany({
            orderBy: [
                {points: 'asc',},
            ],
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
            }
        }); 
    }
    catch (err) {
        console.log(err);
        return null;
    }
    finally{
        async () => {
            await prisma.$disconnect();
        }
    }
}

function dynamicScoringFormula(solves) {
    let lb = parseInt(process.env.LOWER_BOUND)
    let ub = parseInt(process.env.UPPER_BOUND)
    let total = parseInt(process.env.TOTAL_PARTICIPANTS)
	let x = solves / total;
    let initial = parseInt(process.env.CHALLENGE_MAX_POINTS)
    let min = parseInt(process.env.CHALLENGE_MIN_POINTS)
	if (x <= lb) {
		return initial;
	} else if (x >= ub) {
		return min;
	} else {
		return initial - Math.ceil((initial - min) / (ub - lb)) * (x - lb);
	}
}

export async function submitFlag(challengeId, userId, flagSubmission) {
    try {
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
        let correct = false;
        if (challenge['case_insensitive']) {
            correct = Boolean(challenge["flag"].localeCompare(flagSubmission));
        } else {
            correct = challenge["flag"] === flagSubmission;
        }
        await prisma.submissions.create({
            data: {
                added: new Date(),
                challengeId: challengeId,
                userId: userId,
                flag: flagSubmission,
                correct: correct,
            },
        });
        if (correct) {
            await prisma.challenges.update({
                where: {
                    id: challengeId,
                },
                data: {
                    solves: challenge["solves"] + 1 ,
                    points: dynamicScoringFormula(challenge["solves"]),
                },
            }); 
        }       
        return true;
    }
    catch (err) {
        console.log(err);
        return null;
    }
    finally{
        async () => {
            await prisma.$disconnect();
        }
    }
}

