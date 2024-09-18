import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
	// weight: 'variable', // default なので不要。バリアブルフォントでなければ必要
	// display: 'swap', // default なので不要
	// preload: true, // default なので不要
	// adjustFontFallback: true, // next/font/google で default なので不要
	// fallback: ['system-ui', 'arial'], // local font fallback なので不要
});

const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	metadataBase: process.env.VERCEL_URL
		? new URL(`https://${process.env.VERCEL_URL}`)
		: undefined,
	title: {
		default: "Kolumoana Chat UI",
	},
	description: "Kolumoana Chat UI",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export const viewport = {
	themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${notoSansJP.variable} ${geistMono.variable} antialiased`}
			>
				<Toaster position="top-center" />
				<TooltipProvider>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex flex-col flex-1 bg-muted/50">{children}</main>
					</div>
				</TooltipProvider>
				<Analytics />
			</body>
		</html>
	);
}
