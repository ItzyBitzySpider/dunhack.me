import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';

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
		}),
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
		})
	],
	pages: {
		signIn: 'login',
		error: '/login'
	},
	session:{
		strategy: 'jwt'
	}, 
	jwt: {
		// TODO read from env
		secret: "vqIWiGwReiDQzm2XxdECG+vg651K6/ip1EF/NHEVJs4"
	},
	callbacks: {
		session: async ({ session, token, user }) => {
			session.user.id = token.userId;
			session.user.username = token.username;
			session.user.role = token.role;
			return Promise.resolve(session);
		},
		jwt: async ({ token, user, account, profile, isNewUser }) => {
			if(account){
				token.username = user.username;
				token.role = user.role;
				token.userId = user.id;
				// token.user.username = user.username;
				// token.user.role = user.role;
				console.log(JSON.stringify(token))
				return token;
			}
			return token;
		},
		async signIn({ account, profile }) {
			if (process.env.EMAIL_VERIFICATION === 'true') {
				if (profile.email !== null) {
					const emailWhitelisted = await prisma.email_whitelist.findUnique({
						where: {
							email: profile.email,
						},
					});
					if (emailWhitelisted) return true;
					else return false;
				}
				else {
					return false;
				}
			} else {
				return true;
			}			
		},
	},
});

