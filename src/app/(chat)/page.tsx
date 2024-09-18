import { Chat } from "@/components/chat";
import { auth } from "@/lib/auth";
import { AI } from "@/lib/chat/actions";
import type { Session } from "@/lib/types";

export const metadata = {
	title: "Kolumoana Chat UI",
};

export default async function IndexPage() {
	const session = (await auth()) as Session;
	return (
		<AI initialAIState={{ chatId: "", messages: [] }}>
			<Chat session={session} />
		</AI>
	);
}
