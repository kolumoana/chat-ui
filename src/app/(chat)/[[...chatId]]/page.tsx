import { Chat } from "@/components/chat";
import { auth } from "@/lib/auth";
import { AI } from "@/lib/chat/actions";
import type { Session } from "@/lib/types";

export const metadata = {
	title: "Kolumoana Chat UI",
};

interface ChatPageProps {
	params: {
		chatId: string[];
	};
}

const chatMap = new Map<string, string>([
	["1", "Kolumoana"],
	["2", "Kolumoana"],
	["3", "Kolumoana"],
]);

export default async function ChatPage({ params }: ChatPageProps) {
	const session = (await auth()) as Session;
	const id = params.chatId
		? params.chatId.length > 0
			? params.chatId[0]
			: "1"
		: "1";
	console.log({ id });
	const chatName = chatMap.get(id) ?? "Kolumoana";
	return (
		<AI initialAIState={{ chatId: id, messages: [] }}>
			<Chat id={id} session={session} chatName={chatName} />
		</AI>
	);
}
