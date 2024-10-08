import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						passcode: z.string().min(1),
					})
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { passcode } = parsedCredentials.data;
					const dangerousPasscode = process.env.DANGEROUS_PASSCODE;
					if (passcode === dangerousPasscode) {
						return {
							id: "1",
							email: "admin@example.com",
						};
					}
				}

				return null;
			},
		}),
	],
});
