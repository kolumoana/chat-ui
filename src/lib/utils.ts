import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export enum ResultCode {
	InvalidCredentials = "INVALID_CREDENTIALS",
	InvalidSubmission = "INVALID_SUBMISSION",
	UserAlreadyExists = "USER_ALREADY_EXISTS",
	UnknownError = "UNKNOWN_ERROR",
	UserCreated = "USER_CREATED",
	UserLoggedIn = "USER_LOGGED_IN",
	NotYetLogin = "NOT_YET_LOGIN",
}

export const getMessageFromCode = (resultCode: string) => {
	switch (resultCode) {
		case ResultCode.InvalidCredentials:
			return "認証情報が無効です！";
		case ResultCode.InvalidSubmission:
			return "無効な送信です。もう一度お試しください！";
		case ResultCode.UserAlreadyExists:
			return "ユーザーは既に存在します。ログインしてください！";
		case ResultCode.UserCreated:
			return "ユーザーが作成されました。ようこそ！";
		case ResultCode.UnknownError:
			return "問題が発生しました。もう一度お試しください！";
		case ResultCode.UserLoggedIn:
			return "ログインしました！";
		case ResultCode.NotYetLogin:
			return "ログインをしてください！";
	}
};
