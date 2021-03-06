import prisma from './databaseFunctions';
import { logError } from './logging';
import { signOut } from 'next-auth/react';
import { userData, userList } from '../types/custom';
import { Interface } from 'readline';

export async function changeUsername(
	userId: string,
	username: string
): Promise<boolean> {
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

export async function deleteAccount(userId: string): Promise<boolean> {
	try {
		await prisma.user.delete({
			where: { id: userId },
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

export async function getUserInfo(username: string): Promise<userData | null> {
	try {
		return await prisma.user.findUnique({
			where: {
				username: username,
			},
			select: {
				id: true,
				username: true,
				image: true,
			},
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

export async function getUserfromId(userId: string): Promise<userData | null> {
	try {
		return await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				username: true,
				image: true,
			},
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

export async function getAllUsers(): Promise<Array<userList> | null> {
	try {
		return await prisma.user.findMany({
			select: {
				username: true,
			},
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

export async function getAllEligibleUsers(): Promise<Array<userList> | null> {
	try {
		return await prisma.user.findMany({
			where: {
				enabled: true,
			},
			select: {
				username: true,
			},
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

export async function userEnabled(userId: string): Promise<boolean | null> {
	try {
		let user = await prisma.user.findFirst({
			where: {
				id: userId,
			},
			select: {
				enabled: true,
			},
		});
		return user['enabled'];
	} catch (err) {
		logError(err);
		return null;
	} finally {
		async () => {
			await prisma.$disconnect();
		};
	}
}

export async function getTotalEligibleUsers(): Promise<number> {
    try {
		return await prisma.user.count({
			where: {
				enabled: true,
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