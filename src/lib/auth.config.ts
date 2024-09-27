import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
		newUser: "/signup",
	},
	callbacks: {
		async authorized({ auth }) {
			const isLoggedIn = !!auth?.user;

			if (!isLoggedIn) {
				return Response.redirect(new URL("/"));
			}

			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token = { ...token, id: user.id };
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				const { id } = token as { id: string };
				const { user } = session;

				session = { ...session, user: { ...user, id } };
			}

			return session;
		},
	},
	providers: [],
} satisfies NextAuthConfig;
