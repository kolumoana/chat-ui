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
import { generateId } from "ai";
import { UserMessage } from "./message";
export function PromptForm({
	input,
	setInput,
}: {
	input: string;
	setInput: (value: string) => void;
}) {
	const { formRef, onKeyDown } = useEnterSubmit<HTMLTextAreaElement>();
	const inputRef = React.useRef<HTMLTextAreaElement>(null);
	const { submitUserMessage } = useActions<typeof AI>();
	const [, setMessages] = useUIState<typeof AI>();
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

				setMessages((currentMessages) => [
					...currentMessages,
					{
						id: generateId(),
						display: <UserMessage>{value}</UserMessage>,
					},
				]);

				try {
					const responseMessage = await submitUserMessage(value);
					setMessages((currentMessages) => [
						...currentMessages,
						responseMessage,
					]);
				} catch (error) {
					console.error(error);
					window.location.reload();
				}
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
								window.location.reload();
							}}
						>
							<IconPlus />
							<span className="sr-only">新規チャットを開始</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>新規チャットを開始</TooltipContent>
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
