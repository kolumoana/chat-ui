import "server-only";
import { BotMessage } from "@/components/message";
import type { Message } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "@ai-sdk/provider";
import { generateId, streamText } from "ai";
import {
	type createStreamableUI,
	createStreamableValue,
	type getMutableAIState,
} from "ai/rsc";

export const model = openai("gpt-4o-2024-08-06");

type ServerMessage = Message;
export type ClientMessage = { id: string; display: React.ReactNode };

export type AIState = {
	chatId: string;
	messages: ServerMessage[];
};

export type UIState = ClientMessage[];
