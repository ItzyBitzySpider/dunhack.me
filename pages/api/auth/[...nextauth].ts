import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider  from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';

const prisma = new PrismaClient()

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		})
	],
	pages: {
		// new user page here
	}
}); 