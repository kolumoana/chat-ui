"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticate } from "@/lib/login/actions";
import { getMessageFromCode } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconSpinner } from "./ui/icons";

const LoginForm = () => {
	const [result, dispatch] = useFormState(authenticate, undefined);
	const [error, _setError] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (result) {
			if (result.type === "error") {
				toast.error(getMessageFromCode(result.resultCode));
			} else {
				toast.success(getMessageFromCode(result.resultCode));
				router.refresh();
			}
		}
	}, [result, router]);

	return (
		<div className="mx-auto max-w-2xl px-4 mt-4">
			<div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
				<form action={dispatch}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Input
								id="passcode"
								name="passcode"
								type="password"
								placeholder="パスコードを入力"
							/>
						</div>
					</div>
					{error && (
						<Alert variant="destructive" className="mt-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="mt-4">
						<LoginButton />
					</div>
				</form>
			</div>
		</div>
	);
};

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button aria-disabled={pending}>
			{pending ? <IconSpinner /> : "ログイン"}
		</Button>
	);
}

export default LoginForm;
