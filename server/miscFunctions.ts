import prisma from './databaseFunctions';
import { logError } from './logging';

export async function getTotalUsers(): Promise<number> {
    try {
		return await prisma.user.count({
			where: {
				enabled: true,
                competing: true,
                role: "USER",
			},
		});
	} catch (err) {
		logError(err);
		return 0;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}
