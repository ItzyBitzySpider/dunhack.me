import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from 'next-auth/react';

const prisma = new PrismaClient();
import fs from 'fs';
import jsyaml from 'js-yaml';
const config = jsyaml.load(
	fs.readFileSync(__dirname + '/../../../../../config.yml', 'utf8')
);

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: config['EMAIL_SERVER'],
			from: config['EMAIL_FROM'],
		}),
		GithubProvider({
			clientId: config['GITHUB_CLIENT_ID'],
			clientSecret: config['GITHUB_CLIENT_SECRET'],
		}),
		GoogleProvider({
			clientId: config['GOOGLE_CLIENT_ID'],
			clientSecret: config['GOOGLE_CLIENT_SECRET']
		})
	],
	pages: {
		signIn: 'login',
	},
	callbacks: {
		async signIn({ account, profile }) {
		  if (account.provider === "google") {
			return profile.email_verified
		  } else if (account.provider === "github") {
			return true
		  } else {
			if (config['EMAIL_WHITELIST']) {
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

