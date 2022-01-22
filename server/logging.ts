import { Log } from "../types/custom";
import prisma from "./databaseFunctions";

/**
 * Logs Errors and Adds to Database Exceptions Table
 * @param error 
 */
export async function logError(error: Error): Promise<void> {
    try {
		await prisma.exceptions.create({
            data: {
                added: new Date(),
                message: error.message,
                code: error.name,
                trace: error.stack,
            },
        });
	} catch (err) {
        console.log(err);
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Clears all Logs from Database
 */
export async function clearAllLogs(): Promise<void> {
    try {
        await prisma.exceptions.deleteMany({});
	} catch (err) {
		logError(err);
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

/**
 * Retrieves All Logs
 * @returns Logs
 */
export async function getAllLogs(): Promise<Array<Log>> {
    try {
        return await prisma.exceptions.findMany({
            orderBy: {
                added: "desc",
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
    
