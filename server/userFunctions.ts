import prisma from './databaseFunctions';
import { logError } from './logging';
import { signOut } from 'next-auth/react';

export async function changeUsername(userId, username) {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: { username: username },
		});
		return true;
	} catch (err) {
		logError(err);
		return false;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

export async function deleteAccount(userId) {
	try {
		await prisma.user.delete({
			where: { id: userId },
		});
		signOut();
		return true;
	} catch (err) {
		logError(err);
		return false;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

export async function getAllUsers(){
	try{
		return await prisma.user.findMany({
			select:{
				username: true
			}
		})
	}catch (err){
		logError(err);
		return null;
	}
}

export async function getAllEligibleUsers() {
	try{
		return await prisma.user.findMany({
			where: {
				enabled: true,
				competing: true
			},
			select:{
				username: true
			}
		})
	}catch (err){
		logError(err);
		return null;
	}
}

export async function userEnabled(userId) {
	try{
		let user = await prisma.user.findFirst({
			where: {
				id: userId
			},
			select:{
				enabled: true
			}
		})
		return user['enabled'];
	}catch (err){
		logError(err);
		return null;
	}
}