import "server-only";
import {
	createStreamableUI,
	createStreamableValue,
	getMutableAIState,
	streamUI,
} from "ai/rsc";

import { BotMessage, SpinnerMessage } from "@/components/message";
import { generateId, streamText } from "ai";
import { type ClientMessage, model } from "../ai";
import { webSearch } from "../web";
import type { AI } from "./actions";
import { generalSystemPrompt, searchSystemPrompt } from "./prompts";

export const handleAI = async (content: string) => {
	const aiState = getMutableAIState<typeof AI>();

	switch (aiState.get().chatId) {
		case "1": {
			return await generateText(content);
		}
		case "2": {
			return await generateText(content);
		}
		case "3": {
			return await generateSearch(content);
		}
	}

	return await generateText(content);
};

export const generateText = async (content: string): Promise<ClientMessage> => {
	const aiState = getMutableAIState<typeof AI>();

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				id: generateId(),
				role: "user",
				content,
			},
		],
	});

	let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
	let textNode: undefined | React.ReactNode;

	const result = await streamUI({
		model,
		system: generalSystemPrompt,
		messages: aiState.get().messages,
		initial: <SpinnerMessage />,
		text: ({ content, done, delta }) => {
			if (!textStream) {
				textStream = createStreamableValue("");
				textNode = <BotMessage content={textStream.value} />;
			}

			if (done) {
				textStream.done();
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
			} else {
				textStream.update(delta);
			}

			return textNode;
		},
	});

	return {
		id: generateId(),
		display: result.value,
	};
};

export const generateSearch = async (content: string) => {
	const aiState = getMutableAIState<typeof AI>();
	const result = createStreamableUI(
		<div className="flex">
			<SpinnerMessage />
			<div className="text-sm text-gray-500 px-1">検索中...</div>
		</div>,
	);

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				id: generateId(),
				role: "user",
				content,
			},
		],
	});

	(async () => {
		const searchResults = await webSearch(content, 20);
		const prompt = `
${searchSystemPrompt}
====
以下は検索結果です。
${JSON.stringify(searchResults)}
	`;

		const textStreamValue = createStreamableValue("");
		const { textStream, text } = await streamText({
			model: model,
			system: prompt,
			messages: aiState.get().messages,
		});

		let first = true;

		for await (const chunk of textStream) {
			if (first) {
				result.update(<BotMessage content={textStreamValue.value} />);
				first = false;
			}

			textStreamValue.update(chunk);
		}
		result.done();
		textStreamValue.done();

		aiState.done({
			...aiState.get(),
			messages: [
				...aiState.get().messages,
				{
					id: generateId(),
					role: "assistant",
					content: await text,
				},
			],
		});
	})();

	return {
		id: generateId(),
		display: result.value,
	};
};
