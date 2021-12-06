import prisma from './databaseFunctions'
import { logError } from './logging';
import {signOut} from 'next-auth/react'

/**
 * Changes Username of User
 * @param userId 
 * @param username 
 * @returns boolean
 */
 export async function changeUsername(userId, username) {
    try {
        const user = await prisma.User.findOne({id: userId});
        if (!user) {
            throw new Error('User not found');
        }
        await prisma.User.update({
            where: {id: userId},
            data: {username: username}
        });
        return true;
	} catch (err) {
		logError(err);
        return false
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

export async function deleteAccount(userId){
    try {
        const user = await prisma.User.findOne({id: userId});
        if (!user) {
            throw new Error('User not found');
        }
        await prisma.User.delete({
            where: {id: userId}
        });
        signOut();
    } catch (err) {
        logError(err);
        return err
    } finally {
        async () => {
            await prisma.$disconnect();
        };
    }
}