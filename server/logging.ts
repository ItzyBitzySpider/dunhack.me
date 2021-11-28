import prisma from "./database";

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
