import "server-only";
import type { Message } from "@/lib/types";
import { openai } from "@ai-sdk/openai";

export const model = openai("gpt-4o-2024-08-06");

type ServerMessage = Message;
export type ClientMessage = { id: string; display: React.ReactNode };

export type AIState = {
	chatId: string;
	messages: ServerMessage[];
};

export type UIState = ClientMessage[];
