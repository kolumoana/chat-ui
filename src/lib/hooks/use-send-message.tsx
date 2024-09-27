import { useAIState, useActions } from "ai/rsc";
import { useEffect, useState } from "react";
import type { AI } from "../chat/actions";

export const useSendMessage = () => {
	const { submitUserMessage } = useActions<typeof AI>();
	const [aiState] = useAIState<typeof AI>();
	const [block, setBlock] = useState(false);

	const sendMessage = async (message: string) => {
		setBlock(true);
		return submitUserMessage(message);
	};

	useEffect(() => {
		setBlock(false);
	}, [aiState]);

	useEffect(() => {
		console.log("block", block);
	}, [block]);

	return { sendMessage, block };
};
