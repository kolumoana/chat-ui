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
import { webSearch } from "../web";
import { generalSystemPrompt, searchSystemPrompt } from "./prompts";

export const handleAI = async (content: string, actionAI: ActionAI) => {
	startActionAI(actionAI, content);

	const { aiStateGet } = actionAI;

	const id = aiStateGet().chatId;

	let result = "";

	console.log({ id });

	switch (id) {
		case "1": {
			result = await generateText(actionAI);
			break;
		}
		case "2": {
			result = await generateText(actionAI);
			break;
		}
		case "3": {
			result = await generateSearch(content, actionAI);
			break;
		}
	}

	doneActionAI(actionAI, result);
};

export const generateText = async (actionAI: ActionAI) => {
	return streamTextBotMessage(generalSystemPrompt, actionAI);
};

export const generateSearch = async (content: string, actionAI: ActionAI) => {
	const result = await webSearch(content, 20);
	const prompt = `
	${searchSystemPrompt}
	====
	以下は検索結果です。
	${JSON.stringify(result)}
	`;
	return streamTextBotMessage(prompt, actionAI);
};
