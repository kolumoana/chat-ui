import type { CoreMessage } from "ai";

export type Message = CoreMessage & {
	id: string;
};

export interface Chat extends Record<string, unknown> {
	id: string;
	title: string;
	createdAt: Date;
	userId: string;
	path: string;
	messages: Message[];
	sharePath?: string;
}

export type ServerActionResult<Result> = Promise<
	| Result
	| {
			error: string;
	  }
>;

export interface Session {
	user: {
		id: string;
		email: string;
	};
}

export interface AuthResult {
	type: string;
	message: string;
}

export interface User extends Record<string, unknown> {
	id: string;
	email: string;
	password: string;
	salt: string;
}

export interface ExampleMessage {
	id: string;
	heading: string;
	subheading: string;
	message: string;
}
