import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function runner(param) {
    getChallengeByCategory(param)
        .catch((err) => {
            console.log(err);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

async function getChallengeByCategory(categoryName) {
    //@ts-ignore
    let output = await prisma.challenges.findMany({
        orderBy: {
            points: 'asc',
        },
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
    console.log(JSON.stringify(output));
}