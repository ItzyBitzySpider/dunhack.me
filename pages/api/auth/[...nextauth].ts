import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from 'next-auth/react';

const prisma = new PrismaClient();

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		})
	],
	pages: {
		signIn: 'login',
	},
	callbacks: {
		//@ts-ignore (The code below is according to next-auth docs)
		async signIn({ account, profile }) {
		  if (account.provider === "google") {
			return profile.email_verified
		  } else if (account.provider === "github") {
			return true
		  } else {
			if (process.env.EMAIL_VERIFICATION === "true") {
				const emailWhitelisted = await prisma.email_whitelist.findUnique({
					where: {
						email: profile.email,
					},
				});
				if (emailWhitelisted) {
					return true
				}
			}
			else {
				return true
			}
		  }
		  return false
		},
	  }
});

