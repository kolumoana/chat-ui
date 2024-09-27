import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { FooterText } from "@/components/footer";
import { PromptForm } from "@/components/prompt-form";
import type { AI } from "@/lib/chat/actions";
import { useSendMessage } from "@/lib/hooks/use-send-message";
import { useSpeechRecognition } from "@/lib/hooks/use-speech-recognition";
import type { ExampleMessage, Session } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generateId } from "ai";
import { useAIState, useActions, useUIState } from "ai/rsc";
import { ArrowDownIcon, Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";
import { LoginForm } from "./login-form";
import { UserMessage } from "./message";
import { Button } from "./ui/button";
import { IconArrowElbow, IconPlus, IconSpinner } from "./ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export interface VoicePanelProps {
	id?: string;
	title?: string;
	input: string;
	setInput: (value: string) => void;
	isAtBottom: boolean;
	scrollToBottom: () => void;
	session: Session;
	exampleMessages: ExampleMessage[];
}

export function VoicePanel({
	input,
	setInput,
	isAtBottom,
	scrollToBottom,
	session,
	exampleMessages,
}: VoicePanelProps) {
	const [messages, setMessages] = useUIState<typeof AI>();
	const { sendMessage, block } = useSendMessage();
	const { isRecording, transcript, toggleRecording } = useSpeechRecognition({
		onFinalResult: (transcript) => {
			if (block) return;

			setMessages((currentMessages) => [
				...currentMessages,
				{
					id: generateId(),
					display: <UserMessage>{transcript}</UserMessage>,
				},
			]);

			const handle = async () => {
				const responseMessage = await sendMessage(transcript);

				setMessages((currentMessages) => [...currentMessages, responseMessage]);
			};
			handle();
		},
	});

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
						<RecodingForm
							isRecording={isRecording}
							transcript={transcript}
							toggleRecording={toggleRecording}
							isAtBottom={isAtBottom}
							scrollToBottom={scrollToBottom}
							block={block}
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

interface RecodingFormProps {
	isRecording: boolean;
	transcript: string;
	toggleRecording: () => void;
	isAtBottom: boolean;
	scrollToBottom: () => void;
	block: boolean;
}

const RecodingForm = ({
	isRecording,
	transcript,
	toggleRecording,
	isAtBottom,
	scrollToBottom,
	block,
}: RecodingFormProps) => {
	return (
		<div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
			<Tooltip />
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
						onClick={() => {
							window.location.reload();
						}}
					>
						<IconPlus />
						<span className="sr-only">新規チャットを開始</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>新規チャットを開始</TooltipContent>
			</Tooltip>
			<div className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm text-sm text-gray-500 truncate">
				{!block && transcript ? transcript : "\u00A0"}
			</div>
			<div className="absolute right-0 top-[13px] sm:right-4">
				<ButtonScrollToBottom
					isAtBottom={isAtBottom}
					scrollToBottom={scrollToBottom}
					className="mr-2"
				/>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={() => toggleRecording()}
							size="icon"
							variant={
								block ? "outline" : isRecording ? "destructive" : "default"
							}
							disabled={block}
						>
							{isRecording ? (
								<>
									<MicOff className="h-4 w-4" />
								</>
							) : (
								<>
									<Mic className="h-4 w-4" />
								</>
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{isRecording ? (block ? "認識中" : "停止") : "録音開始"}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};
