import Link from "next/link";
import * as React from "react";
import { Button } from "./ui/button";

export const Header = () => {
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
			<div className="flex items-center justify-end space-x-2">
				<Link href="/" legacyBehavior passHref>
					<Button variant="ghost">
						<span className="hidden sm:block">Kolumoana Chat UI</span>
					</Button>
				</Link>
			</div>
		</header>
	);
};
