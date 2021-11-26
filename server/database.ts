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

