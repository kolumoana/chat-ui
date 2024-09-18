import { ExternalLink } from "@/components/external-link";

export function EmptyScreen() {
	return (
		<div className="mx-auto max-w-2xl px-4">
			<div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
				<h1 className="text-lg font-semibold">Kolumoana Chat UIへようこそ！</h1>
				<p className="leading-normal text-muted-foreground">
					これはKolumoanaの最先端のAIチャットボットインターフェースサンプルです。
					<br />
					<ExternalLink href="https://nextjs.org">Next.js</ExternalLink>と
					<ExternalLink href="https://sdk.vercel.ai">
						Vercel AI SDK
					</ExternalLink>
					を使用して構築されています。
				</p>
				<p className="leading-normal text-muted-foreground">
					<ExternalLink href="https://vercel.com/blog/ai-sdk-3-generative-ui">
						React Server Components
					</ExternalLink>
					を活用し、生成UIを実現しています。
				</p>
				<p className="leading-normal text-muted-foreground">
					直感的な操作性を是非お楽しみください。
					<br />
					AIがスムーズにお答えします。
				</p>
			</div>
		</div>
	);
}
