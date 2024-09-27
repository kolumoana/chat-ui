import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { FooterText } from "@/components/footer";
import { PromptForm } from "@/components/prompt-form";
import type { AI } from "@/lib/chat/actions";
import { useSendMessage } from "@/lib/hooks/use-send-message";
import type { ExampleMessage, Session } from "@/lib/types";
import { generateId } from "ai";
import { useAIState, useActions, useUIState } from "ai/rsc";
import { useEffect, useState } from "react";
import { LoginForm } from "./login-form";
import { UserMessage } from "./message";

export interface ChatPanelProps {
	id?: string;
	title?: string;
	input: string;
	setInput: (value: string) => void;
	isAtBottom: boolean;
	scrollToBottom: () => void;
	session: Session;
	exampleMessages: ExampleMessage[];
}

export function ChatPanel({
	input,
	setInput,
	isAtBottom,
	scrollToBottom,
	session,
	exampleMessages,
}: ChatPanelProps) {
	const [messages, setMessages] = useUIState<typeof AI>();
	const { sendMessage, block } = useSendMessage();

	const handleExampleClick =
		(example: ExampleMessage) => async (e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				setMessages((currentMessages) => [
					...currentMessages,
					{
						id: generateId(),
						display: <UserMessage>{example.message}</UserMessage>,
					},
				]);

				const responseMessage = await sendMessage(example.message);

				setMessages((currentMessages) => [...currentMessages, responseMessage]);
			}
		};

	return (
		<div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
			<ButtonScrollToBottom
				isAtBottom={isAtBottom}
				scrollToBottom={scrollToBottom}
			/>

			<div className="mx-auto sm:max-w-2xl sm:px-4">
				{session && (
					<div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
						{messages.length === 0 &&
							exampleMessages.map((example, index) => (
								<div
									key={example.heading}
									className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
										index > 1 && "hidden md:block"
									}`}
									onClick={() =>
										handleExampleClick(example)({
											key: "Enter",
										} as React.KeyboardEvent)
									}
									onKeyDown={(e) =>
										e.key === "Enter" && handleExampleClick(example)(e)
									}
								>
									<div className="text-sm font-semibold">{example.heading}</div>
									<div className="text-sm text-zinc-600">
										{example.subheading}
									</div>
								</div>
							))}
					</div>
				)}

				<div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
					{session ? (
						<PromptForm
							input={input}
							setInput={setInput}
							topBlock={block}
							isAtBottom={isAtBottom}
							scrollToBottom={scrollToBottom}
						/>
					) : (
						<LoginForm />
					)}
					<FooterText className="hidden sm:block" />
				</div>
			</div>
		</div>
	);
}
