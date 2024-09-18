"use client";

import * as React from "react";
import Textarea from "react-textarea-autosize";

import { useActions, useUIState } from "ai/rsc";

import { Button } from "@/components/ui/button";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AI } from "@/lib/chat/actions";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import type { Session } from "@/lib/types";
import { generateId } from "ai";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserMessage } from "./message";
export function PromptForm({
	input,
	setInput,
}: {
	input: string;
	setInput: (value: string) => void;
}) {
	const router = useRouter();
	const { formRef, onKeyDown } = useEnterSubmit();
	const inputRef = React.useRef<HTMLTextAreaElement>(null);
	const { submitUserMessage } = useActions<typeof AI>();
	const [_, setMessages] = useUIState<typeof AI>();

	React.useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<form
			ref={formRef}
			onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();

				// Blur focus on mobile
				if (window.innerWidth < 600) {
					(e.target as HTMLFormElement)
						.querySelector<HTMLInputElement>('input[name="message"]')
						?.blur();
				}

				const value = input.trim();
				setInput("");
				if (!value) return;

				// Optimistically add user message UI
				setMessages((currentMessages) => [
					...currentMessages,
					{
						id: generateId(),
						display: <UserMessage>{value}</UserMessage>,
					},
				]);

				// Submit and get response message
				console.log("before submitUserMessage");
				const responseMessage = await submitUserMessage(value);
				console.log(`after submitUserMessage: ${responseMessage.display}`);
				setMessages((currentMessages) => [...currentMessages, responseMessage]);
			}}
		>
			<div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
							onClick={() => {
								router.push("/new");
							}}
						>
							<IconPlus />
							<span className="sr-only">新規作成</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>新規作成</TooltipContent>
				</Tooltip>
				<Textarea
					ref={inputRef}
					tabIndex={0}
					onKeyDown={onKeyDown}
					placeholder="メッセージを送信"
					className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
					autoFocus
					spellCheck={false}
					autoComplete="off"
					autoCorrect="off"
					name="message"
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<div className="absolute right-0 top-[13px] sm:right-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button type="submit" size="icon" disabled={input === ""}>
								<IconArrowElbow />
								<span className="sr-only">送信</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>送信</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</form>
	);
}
