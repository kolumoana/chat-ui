"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { authenticate } from "@/lib/login/actions";
import { getMessageFromCode } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";
import { IconArrowElbow, IconKey, IconSpinner } from "./ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const LoginForm = () => {
	const [result, dispatch] = useFormState(authenticate, undefined);
	const { formRef, onKeyDown } = useEnterSubmit<HTMLInputElement>();
	const router = useRouter();
	const [input, setInput] = useState("");
	useEffect(() => {
		if (result) {
			if (result.type === "error") {
				toast.error(getMessageFromCode(result.resultCode));
			} else {
				toast.success(getMessageFromCode(result.resultCode));
				router.refresh();
			}
		}
	}, [result, router]);

	return (
		<form
			onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();

				// Blur focus on mobile
				if (window.innerWidth < 600) {
					(e.target as HTMLFormElement)
						.querySelector<HTMLInputElement>('input[name="passcode"]')
						?.blur();
				}

				const value = input.trim();
				setInput("");
				if (!value) return;

				dispatch(new FormData(e.target as HTMLFormElement));
			}}
			ref={formRef}
		>
			<div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
				<div className="flex items-center justify-center h-9 w-9 absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4 border">
					<IconKey />
				</div>
				<input
					id="passcode"
					name="passcode"
					type="password"
					placeholder="パスコードを入力"
					className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm border-none focus:border-none focus:outline-none"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={onKeyDown}
				/>
				<div className="absolute right-0 top-[13px] sm:right-4">
					<LoginButton input={input} />
				</div>
			</div>
		</form>
	);
};

function LoginButton({ input }: { input: string }) {
	const { pending } = useFormStatus();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="submit"
					size="icon"
					aria-disabled={pending}
					disabled={input === ""}
				>
					{pending ? <IconSpinner /> : <IconArrowElbow />}
					<span className="sr-only">送信</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>送信</TooltipContent>
		</Tooltip>
	);
}
