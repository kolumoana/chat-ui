import { Separator } from "@/components/ui/separator";
import type { UIState } from "@/lib/chat/actions";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export interface ChatList {
	messages: UIState;
}

export function ChatList({ messages }: ChatList) {
	if (!messages.length) {
		return null;
	}

	useEffect(() => {
		for (const message of messages) {
			console.log("message", message.display);
		}
	}, [messages]);

	return (
		<div className="relative mx-auto max-w-2xl px-4">
			<div className="group relative mb-4 flex items-start md:-ml-12">
				<div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
					<ExclamationTriangleIcon />
				</div>
				<div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
					<p className="text-muted-foreground leading-normal">
						使用履歴は保存されません。ご注意ください。
					</p>
				</div>
			</div>
			<Separator className="my-4" />

			{messages.map((message, index) => (
				<div key={`${message.id}-${index}`}>
					{message.display}
					{index < messages.length - 1 && <Separator className="my-4" />}
				</div>
			))}
		</div>
	);
}
