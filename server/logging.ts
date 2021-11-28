import prisma from "./database";

/**
 * Logs Errors and Adds to Database Exceptions Tab;e
 * @param error 
 */

export async function logError(error: Error) {
    //@ts-ignore
    await prisma.exceptions.create({
        data: {
            added: new Date(),
            message: error.message,
            code: error.name,
            trace: error.stack,
        },
    });
}
