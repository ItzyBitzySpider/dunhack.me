import NextAuth from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface User {
		id: string;
		name?: string | null;
		username: string;
		email?: string | null;
		image?: string | null;
		role?: string | null;
	}

	interface Session {
		user: {
			id: string;
			name?: string | null;
			username: string;
			email?: string | null;
			image?: string | null;
			role?: string | null;
		}
	}
}

import { JWT } from 'next-auth/jwt';

declare module "next-auth/jwt" {
	interface JWT {
		userId: string;
		username: string;
		role: string;
	}
}