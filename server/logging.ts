import prisma from "./databaseFunctions";

/**
 * Logs Errors and Adds to Database Exceptions Tab;e
 * @param error 
 */

export async function logError(error: Error) {
    await prisma.exceptions.create({
        data: {
            added: new Date(),
            message: error.message,
            code: error.name,
            trace: error.stack,
        },
    });
}

