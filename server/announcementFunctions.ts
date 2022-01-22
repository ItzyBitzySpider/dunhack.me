import { announcements } from '@prisma/client';
import prisma from './databaseFunctions';
import { logError } from './logging';

export async function getAnnouncements(): Promise<Array<announcements>>{
    try {
		return await prisma.announcements.findMany({
            orderBy: {
                added: 'desc'
            },
            select: {
                id: true,
                added: true,
                addedBy: true,
                title: true,
                body: true
            }
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



