"use client";
import { Button } from "./ui/button";
import { IconKolumoana } from "./ui/icons";

export const Header = () => {
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
			<div className="flex items-center justify-end space-x-2">
				<Button
					variant="ghost"
					onClick={() => {
						window.location.reload();
					}}
				>
					<div className="flex flex-row items-center space-x-2">
						<IconKolumoana />
						<span className="hidden sm:block">Kolumoana Chat UI</span>
					</div>
				</Button>
			</div>
		</header>
	);
};
