import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { IconKolumoana } from "./ui/icons";

interface HeaderProps {
	children: React.ReactNode;
}

export const Header = async ({ children }: HeaderProps) => {
	const session = await auth();
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
			<div className="flex items-center justify-end space-x-2">{children}</div>
			{session ? (
				<div className="flex items-center justify-end space-x-2">
					<Link href="/" className="text-sm" passHref rel="noopener noreferrer">
						<Button variant="ghost" className="border rounded-md">
							一般
						</Button>
					</Link>
					<Link
						href="/2"
						className="text-sm"
						passHref
						rel="noopener noreferrer"
					>
						<Button variant="ghost" className="border rounded-md">
							音声
						</Button>
					</Link>
				</div>
			) : null}
		</header>
	);
};

export const Logo = () => (
	<div className="flex flex-row items-center space-x-2">
		<IconKolumoana />
		<span className="hidden sm:block">Kolumoana Chat UI</span>
	</div>
);
