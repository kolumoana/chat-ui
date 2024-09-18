import "server-only";

import { openai } from "@ai-sdk/openai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";

import { BotMessage, SpinnerMessage } from "@/components/message";
import type { Message } from "@/lib/types";
import { generateId } from "ai";
import { auth } from "../auth";

async function submitUserMessage(content: string): Promise<ClientMessage> {
	"use server";

	const session = await auth();
	if (!session) {
		throw new Error("Unauthorized");
	}

	const aiState = getMutableAIState<typeof AI>();

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				id: generateId(),
				role: "user" as const,
				content,
			},
		],
	});

	const result = await streamUI({
		model: openai("gpt-4o-mini"),
		initial: <SpinnerMessage />,
		system: `\
		あなたはユーザーの投資アドバイザーです。
		ユーザーの投資の目的、投資のスタイル、投資のリスク許容度を確認して、適切な投資アドバイスを行います。
`,
		messages: aiState.get().messages,
		text: ({ content, done }) => {
			if (done) {
				aiState.done({
					...aiState.get(),
					messages: [
						...aiState.get().messages,
						{
							id: generateId(),
							role: "assistant",
							content,
						},
					],
				});
			}

			return <BotMessage content={content} />;
		},
	});

	return {
		id: generateId(),
		display: result.value,
	};
}

type ServerMessage = Message;
type ClientMessage = { id: string; display: React.ReactNode };

export type AIState = {
	chatId: string;
	messages: ServerMessage[];
};

export type UIState = ClientMessage[];

const actions = {
	submitUserMessage,
};

export const AI = createAI<AIState, UIState, typeof actions>({
	actions,
	initialUIState: [],
	initialAIState: { chatId: generateId(), messages: [] },
});
