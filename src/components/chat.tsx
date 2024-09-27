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
	// 一般カテゴリー
	{
		id: "1",
		heading: "プログラミング",
		subheading: "Pythonの基礎",
		message: "Pythonプログラミングの基本的な構文について教えてください。",
	},
	{
		id: "1",
		heading: "デザイン",
		subheading: "UI/UXの原則",
		message: "効果的なUI/UXデザインの主要な原則を説明してください。",
	},
	{
		id: "1",
		heading: "プロジェクト管理",
		subheading: "アジャイルとウォーターフォール",
		message: "アジャイル開発とウォーターフォール開発の違いを教えてください。",
	},
	{
		id: "1",
		heading: "データベース",
		subheading: "SQLの基本",
		message: "SQLデータベースの基本的なクエリ構文を教えてください。",
	},

	// 音声入力カテゴリー
	{
		id: "2",
		heading: "セキュリティ",
		subheading: "Webアプリのベストプラクティス",
		message:
			"Webアプリケーション開発におけるセキュリティのベストプラクティスを説明してください。",
	},
	{
		id: "2",
		heading: "クラウド",
		subheading: "クラウドコンピューティングの利点",
		message:
			"クラウドコンピューティングを採用する主な利点について詳しく教えてください。",
	},
	{
		id: "2",
		heading: "AI/機械学習",
		subheading: "ビジネスでの活用例",
		message:
			"AI・機械学習技術のビジネスにおける具体的な活用例を挙げてください。",
	},
	{
		id: "2",
		heading: "モバイル開発",
		subheading: "ネイティブvsハイブリッド",
		message:
			"モバイルアプリ開発におけるネイティブアプリとハイブリッドアプリの違いと選択基準を説明してください。",
	},

	// 検索カテゴリー
	{
		id: "3",
		heading: "プログラミング言語",
		subheading: "人気のある言語ランキング",
		message:
			"2024年に人気のあるプログラミング言語のランキングを検索してください。",
	},
	{
		id: "3",
		heading: "テクノロジートレンド",
		subheading: "最新のITトレンド",
		message:
			"現在のIT業界における最新のテクノロジートレンドを検索してください。",
	},
	{
		id: "3",
		heading: "オープンソース",
		subheading: "人気のフレームワーク",
		message:
			"Webアプリケーション開発で人気の高いオープンソースフレームワークを検索してください。",
	},
	{
		id: "3",
		heading: "開発ツール",
		subheading: "生産性向上ツール",
		message:
			"ソフトウェア開発者の生産性を向上させる最新のツールやIDE（統合開発環境）を検索してください。",
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
