"use client";

import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { VoicePanel } from "@/components/voice-panel";
import type { AI } from "@/lib/chat/actions";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import type { ExampleMessage, Message } from "@/lib/types";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAIState, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export interface ChatProps extends React.ComponentProps<"div"> {
	initialMessages?: Message[];
	session: Session;
	chatName: string;
	panelType: "text" | "voice";
}

const exampleMessages: ExampleMessage[] = [
	{
		id: "1",
		heading: "今日の",
		subheading: "トレンドのミームコインは？",
		message: "今日のトレンドのミームコインは何ですか？",
	},
	{
		id: "1",
		heading: "$DOGEの",
		subheading: "現在の価格は？",
		message: "$DOGEの現在の価格はいくらですか？",
	},
	{
		id: "1",
		heading: "42 $DOGEを",
		subheading: "購入したいです",
		message: "42 $DOGEを購入したいです",
	},
	{
		id: "1",
		heading: "$DOGEに関する",
		subheading: "最近のニュースは？",
		message: "$DOGEに関する最近のニュースは何かありますか？",
	},
];

export function Chat({ id, className, session, panelType }: ChatProps) {
	const router = useRouter();
	const [input, setInput] = useState("");
	const [aiState] = useAIState<typeof AI>();

	const [messages] = useUIState<typeof AI>();

	useEffect(() => {
		const messagesLength = aiState.messages?.length;
		if (messagesLength === 2) {
			router.refresh();
		}
	}, [aiState.messages, router]);

	const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
		useScrollAnchor();

	const filteredExampleMessages = exampleMessages.filter(
		(message) => message.id === id,
	);

	return (
		<div
			className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
			ref={scrollRef}
		>
			<div
				className={cn("pb-[200px] pt-4 md:pt-10", className)}
				ref={messagesRef}
			>
				{messages.length ? (
					<ChatList messages={messages} />
				) : id === "1" ? (
					<EmptyScreen />
				) : null}
				<div className="w-full h-px" ref={visibilityRef} />
			</div>
			{panelType === "text" ? (
				<ChatPanel
					id={id}
					input={input}
					setInput={setInput}
					isAtBottom={isAtBottom}
					scrollToBottom={scrollToBottom}
					session={session}
					exampleMessages={filteredExampleMessages}
				/>
			) : panelType === "voice" ? (
				<VoicePanel
					id={id}
					input={input}
					setInput={setInput}
					isAtBottom={isAtBottom}
					scrollToBottom={scrollToBottom}
					session={session}
					exampleMessages={filteredExampleMessages}
				/>
			) : null}
		</div>
	);
}
