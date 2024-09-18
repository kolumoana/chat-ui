"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const Header = () => {
	const router = useRouter();
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
			<div className="flex items-center justify-end space-x-2">
				<Button
					variant="ghost"
					onClick={() => {
						router.push("/new");
					}}
				>
					<span className="hidden sm:block">Kolumoana Chat UI</span>
				</Button>
			</div>
		</header>
	);
};
