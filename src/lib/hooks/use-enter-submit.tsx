import { type RefObject, useRef } from "react";

export function useEnterSubmit<T>(): {
	formRef: RefObject<HTMLFormElement>;
	onKeyDown: (event: React.KeyboardEvent<T>) => void;
} {
	const formRef = useRef<HTMLFormElement>(null);

	const handleKeyDown = (event: React.KeyboardEvent<T>): void => {
		if (
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			formRef.current?.requestSubmit();
			event.preventDefault();
		}
	};

	return { formRef, onKeyDown: handleKeyDown };
}
