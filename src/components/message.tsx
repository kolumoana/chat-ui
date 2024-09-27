"use client";

import { MemoizedReactMarkdown } from "@/components/markdown";
import { CodeBlock } from "@/components/ui/codeblock";
import { IconOpenAI, IconUser } from "@/components/ui/icons";
import { useStreamableText } from "@/lib/hooks/use-streamable-text";
import { cn } from "@/lib/utils";
import type { StreamableValue } from "ai/rsc";
import React from "react";
import type { ClassAttributes, HTMLAttributes } from "react";
import type { Components, ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { Pluggable } from "unified";
import { spinner } from "./spinner";

export function UserMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="group relative flex items-start md:-ml-12">
			<div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
				<IconUser />
			</div>
			<div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
				{children}
			</div>
		</div>
	);
}

const components: Partial<Components> = {
	p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p className="mb-2 last:mb-0" {...props}>
			{children}
		</p>
	),
	pre: ({
		children,
		...props
	}: ClassAttributes<HTMLPreElement> &
		HTMLAttributes<HTMLPreElement> &
		ExtraProps) => {
		if (!children || typeof children !== "object") {
			return <code {...props}>{children}</code>;
		}
		const childType = "type" in children ? children.type : "";
		if (childType !== "code") {
			return <code {...props}>{children}</code>;
		}

		interface ContentInfo {
			content: string;
			language: string;
		}

		const innerRecursive = (children: React.ReactNode): ContentInfo => {
			if (React.isValidElement(children)) {
				// Check if the element has a className that starts with "language-"
				const languageClass = children.props.className?.match(/language-(\w+)/);
				const language = languageClass?.[1] ?? "";

				if (children.props.children) {
					const result = innerRecursive(children.props.children);
					return {
						content: result.content,
						language: language || result.language,
					};
				}
				if (Array.isArray(children.props.children)) {
					const results = children.props.children.map(innerRecursive);
					return {
						content: results
							.map((r: { content: string }) => r.content)
							.join(""),
						language:
							language ||
							results.find((r: { language?: string }) => r.language)
								?.language ||
							"",
					};
				}
			}
			return {
				content: String(children).replace(/\n$/, ""),
				language: "",
			};
		};

		const { content, language } = innerRecursive(children);

		return (
			<CodeBlock
				key={Math.random()}
				language={language}
				value={content}
				{...props}
			/>
		);
	},
};

const remarkPlugins: Pluggable[] = [remarkGfm, remarkMath];

export function BotMessage({
	content,
	className,
}: {
	content: string | StreamableValue<string>;
	className?: string;
}) {
	const text = useStreamableText(content);

	return (
		<div className={cn("group relative flex items-start md:-ml-12", className)}>
			<div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
				<IconOpenAI />
			</div>
			<div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
				<MemoizedReactMarkdown
					className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
					remarkPlugins={remarkPlugins}
					components={components}
				>
					{text}
				</MemoizedReactMarkdown>
			</div>
		</div>
	);
}

export function BotCard({
	children,
	showAvatar = true,
}: {
	children: React.ReactNode;
	showAvatar?: boolean;
}) {
	return (
		<div className="group relative flex items-start md:-ml-12">
			<div
				className={cn(
					"flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
					!showAvatar && "invisible",
				)}
			>
				<IconOpenAI />
			</div>
			<div className="ml-4 flex-1 pl-2">{children}</div>
		</div>
	);
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={
				"mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
			}
		>
			<div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
		</div>
	);
}

export function SpinnerMessage() {
	return (
		<div className="group relative flex items-start md:-ml-12">
			<div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
				<IconOpenAI />
			</div>
			<div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
				{spinner}
			</div>
		</div>
	);
}
