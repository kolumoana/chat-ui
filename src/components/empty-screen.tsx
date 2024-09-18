import { ExternalLink } from "@/components/external-link";

export function EmptyScreen() {
	return (
		<div className="mx-auto max-w-2xl px-4">
			<div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
				<h1 className="text-lg font-semibold">Kolumoana Chat UIへようこそ！</h1>
				<p className="leading-normal text-muted-foreground">
					<ExternalLink href="https://kolumoana.com/">コルモアナ</ExternalLink>
					のAIチャットボットをご利用いただきありがとうございます。
				</p>
				<p className="leading-normal text-muted-foreground">
					<ExternalLink href="https://nextjs.org">Next.js</ExternalLink>と
					<ExternalLink href="https://openai.com/">OpenAI API</ExternalLink>
					を活用し、直感的で使いやすいインターフェースを提供しています。
				</p>
				<p className="leading-normal text-muted-foreground">
					AI技術を最大限に活用し、貴社の課題解決をサポートします。
				</p>
				<p className="leading-normal text-muted-foreground">
					まずはお気軽にご利用ください。
				</p>
			</div>
		</div>
	);
}
