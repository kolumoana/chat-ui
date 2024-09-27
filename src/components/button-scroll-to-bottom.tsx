"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { IconArrowDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ButtonScrollToBottomProps extends ButtonProps {
	isAtBottom: boolean;
	scrollToBottom: () => void;
}

export function ButtonScrollToBottom({
	className,
	isAtBottom,
	scrollToBottom,
	...props
}: ButtonScrollToBottomProps) {
	return (
		<Button
			variant="outline"
			size="icon"
			className={cn(
				"bg-background transition-opacity duration-300",
				isAtBottom ? "opacity-0" : "opacity-100",
				className,
			)}
			onClick={() => scrollToBottom()}
			{...props}
		>
			<IconArrowDown />
			<span className="sr-only">Scroll to bottom</span>
		</Button>
	);
}
