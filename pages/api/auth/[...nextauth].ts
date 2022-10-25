import NextAuth from 'next-auth';
import prisma from "../../../server/databaseFunctions";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';

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
		signIn: '/login',
		error: '/login'
	},
	callbacks: {
		session: async ({ session, user }) => {
			session.user.id = user.id;
			session.user.username = user.username;
			session.user.role = user.role;
			return Promise.resolve(session);
		},
		async signIn({ account, profile, email }) {
			if (process.env.EMAIL_VERIFICATION === 'true') {
        if (email) {
          if (email.verificationRequest) {
            return true;
          } else if (email.email) {
            const emailWhitelisted = await prisma.email_whitelist.findUnique({
              where: {
                email: email.email,
              },
            });
            if (emailWhitelisted) return true;
            else return false;
          }
        } else if (profile) {
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
					return false
				}
        }
			} else {
				return true
			}			
		},
	},
	secret: process.env.JWT_SECRET,
});

