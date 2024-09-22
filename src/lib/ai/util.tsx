export interface AIHandler {
	updateState: (content: string) => void;
	getStreamResult: () => Promise<{ textStream: ReadableStream<string> }>;
	updateUI: (content: string) => void;
	finishInteraction: (content: string) => void;
}

export const textInstruction = async (content: string, handler: AIHandler) => {
	handler.updateState(content);
	const result = await handler.getStreamResult();

	const reader = result.textStream.getReader();
	let acc = "";

	while (true) {
		const { done, value } = await reader.read();
		if (value) {
			acc += value;
			handler.updateUI(acc);
		}

		if (done) {
			handler.finishInteraction(acc);
			break;
		}
	}
};
