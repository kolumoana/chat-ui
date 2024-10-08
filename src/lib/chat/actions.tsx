import "server-only";
import { generateId } from "ai";
import { createAI } from "ai/rsc";
import type { AIState, ClientMessage, UIState } from "../ai";
import { auth } from "../auth";
import { handleAI } from "./usecases";

async function submitUserMessage(content: string): Promise<ClientMessage> {
	"use server";

	const session = await auth();
	if (!session) {
		throw new Error("Unauthorized");
	}

	const result = await handleAI(content);

	return result;
}

const actions = {
	submitUserMessage,
};

export const AI = createAI<AIState, UIState, typeof actions>({
	actions,
	initialUIState: [],
	initialAIState: { chatId: generateId(), messages: [] },
});
