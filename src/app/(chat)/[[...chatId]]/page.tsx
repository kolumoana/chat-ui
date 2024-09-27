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

interface ChatDetail {
	chatName: string;
	panelType: "text" | "voice";
}

const chatMap = new Map<string, ChatDetail>([
	["1", { chatName: "Kolumoana", panelType: "text" }],
	["2", { chatName: "音声", panelType: "voice" }],
	["3", { chatName: "検索", panelType: "text" }],
]);

export default async function ChatPage({ params }: ChatPageProps) {
	const session = (await auth()) as Session;
	const id = params.chatId
		? params.chatId.length > 0
			? params.chatId[0]
			: "1"
		: "1";
	const chatDetail = chatMap.get(id) ?? {
		chatName: "Kolumoana",
		panelType: "text",
	};
	return (
		<AI initialAIState={{ chatId: id, messages: [] }}>
			<Chat
				id={id}
				session={session}
				chatName={chatDetail.chatName}
				panelType={chatDetail.panelType}
			/>
		</AI>
	);
}
