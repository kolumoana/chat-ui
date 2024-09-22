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

const model = openai("gpt-4o-2024-08-06");

type ServerMessage = Message;
type ClientMessage = { id: string; display: React.ReactNode };

export type AIState = {
	chatId: string;
	messages: ServerMessage[];
};

export type UIState = ClientMessage[];

export interface ActionAI {
	model: LanguageModelV1;
	aiStateGet: () => AIState;
	aiStateUpdate: (state: AIState) => void;
	aiStateDone: (state: AIState) => void;
	uiUpdate: (display: React.ReactNode) => void;
	uiDone: (display: React.ReactNode) => void;
}

export const createActionAI = (
	streamableUI: ReturnType<typeof createStreamableUI>,
	aiState: ReturnType<typeof getMutableAIState>,
): ActionAI => {
	return {
		model,
		aiStateGet: () => aiState.get(),
		aiStateUpdate: (state) => aiState.update(state),
		aiStateDone: (state) => aiState.update(state),
		uiUpdate: (display) => streamableUI.update(display),
		uiDone: (display) => streamableUI.update(display),
	};
};

export const startActionAI = async (ai: ActionAI, content: string) => {
	const { aiStateGet, aiStateUpdate } = ai;

	aiStateUpdate({
		...aiStateGet(),
		messages: [
			...aiStateGet().messages,
			{
				id: generateId(),
				role: "user" as const,
				content,
			},
		],
	});
};

export const doneActionAI = async (ai: ActionAI, result: string) => {
	const { aiStateGet, aiStateDone } = ai;

	aiStateDone({
		...aiStateGet(),
		messages: [
			...aiStateGet().messages,
			{
				id: generateId(),
				role: "assistant" as const,
				content: result,
			},
		],
	});
};

export const streamTextBotMessage = async (
	system: string,
	ai: ActionAI,
): Promise<string> => {
	const { model, aiStateGet, uiUpdate, uiDone } = ai;

	const result = await streamText({
		model,
		system,
		messages: aiStateGet().messages,
	});

	const textStream = createStreamableValue("");
	const textNode = <BotMessage content={textStream.value} />;
	let start = false;

	const reader = result.textStream.getReader();

	while (true) {
		const { done, value } = await reader.read();
		if (value) {
			if (!start) {
				uiUpdate(textNode);
				start = true;
			}
			textStream.update(value);
		}

		if (done) {
			uiDone(textNode);
			break;
		}
	}

	return textStream.value as string;
};
