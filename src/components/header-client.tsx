"use client";
import { Button } from "./ui/button";

interface HeaderButtonProps {
	children: React.ReactNode;
}

export const HeaderButton = ({ children }: HeaderButtonProps) => (
	<Button
		variant="ghost"
		onClick={() => {
			window.location.reload();
		}}
	>
		{children}
	</Button>
);
