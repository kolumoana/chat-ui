"use client";

import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import type { AI } from "@/lib/chat/actions";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import type { Message } from "@/lib/types";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAIState, useUIState } from "ai/rsc";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import LoginForm from "./login-form";
export interface ChatProps extends React.ComponentProps<"div"> {
	initialMessages?: Message[];
	session: Session;
}

export function Chat({ id, className, session }: ChatProps) {
	const router = useRouter();
	const _path = usePathname();
	const [input, setInput] = useState("");
	const [messages] = useUIState<typeof AI>();
	const [aiState] = useAIState<typeof AI>();

	useEffect(() => {
		const messagesLength = aiState.messages?.length;
		if (messagesLength === 2) {
			router.refresh();
		}
	}, [aiState.messages, router]);

	const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
		useScrollAnchor();

	return (
		<div
			className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
			ref={scrollRef}
		>
			<div
				className={cn("pb-[200px] pt-4 md:pt-10", className)}
				ref={messagesRef}
			>
				{messages.length ? <ChatList messages={messages} /> : <EmptyScreen />}
				{!session && <LoginForm />}
				<div className="w-full h-px" ref={visibilityRef} />
			</div>
			{session && (
				<ChatPanel
					id={id}
					input={input}
					setInput={setInput}
					isAtBottom={isAtBottom}
					scrollToBottom={scrollToBottom}
				/>
			)}
		</div>
	);
}
