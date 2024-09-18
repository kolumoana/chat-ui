"use server";

import { signIn } from "@/lib/auth";
import { User } from "@/lib/types";
import { ResultCode } from "@/lib/utils";
import { AuthError } from "next-auth";
import { z } from "zod";

interface Result {
	type: string;
	resultCode: ResultCode;
}

export async function authenticate(
	_prevState: Result | undefined,
	formData: FormData,
): Promise<Result | undefined> {
	try {
		const passcode = formData.get("passcode");

		const parsedCredentials = z
			.object({
				passcode: z.string().min(1),
			})
			.safeParse({
				passcode,
			});

		console.log("parsedCredentials", parsedCredentials.error);

		if (parsedCredentials.success) {
			await signIn("credentials", {
				passcode,
				redirect: false,
			});

			return {
				type: "success",
				resultCode: ResultCode.UserLoggedIn,
			};
		}

		return {
			type: "error",
			resultCode: ResultCode.InvalidCredentials,
		};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						type: "error",
						resultCode: ResultCode.InvalidCredentials,
					};
				default:
					return {
						type: "error",
						resultCode: ResultCode.UnknownError,
					};
			}
		}
	}
}
