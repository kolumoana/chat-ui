import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Kolumoana Chat UI",
	description: "Kolumoana Chat UI",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
