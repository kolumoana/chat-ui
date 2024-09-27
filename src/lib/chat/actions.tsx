import "server-only";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import { SpinnerMessage } from "@/components/message";
import { generateId } from "ai";
import {
	type AIState,
	type ActionAI,
	type ClientMessage,
	type UIState,
	createActionAI,
	doneActionAI,
	startActionAI,
	streamTextBotMessage,
} from "../ai";
import { auth } from "../auth";
import { handleAI } from "./usecases";

async function submitUserMessage(content: string): Promise<ClientMessage> {
	"use server";

	const session = await auth();
	if (!session) {
		throw new Error("Unauthorized");
	}

	const streamableUI = createStreamableUI(<SpinnerMessage />);
	const aiState = getMutableAIState<typeof AI>();

	const actionAI = createActionAI(streamableUI, aiState);

	handleAI(content, actionAI);

	return {
		id: generateId(),
		display: streamableUI.value,
	};
}

const actions = {
	submitUserMessage,
};

export const AI = createAI<AIState, UIState, typeof actions>({
	actions,
	initialUIState: [],
	initialAIState: { chatId: generateId(), messages: [] },
});
