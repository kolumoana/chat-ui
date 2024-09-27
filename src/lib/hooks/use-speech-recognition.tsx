import { useEffect, useRef, useState } from "react";

export const useSpeechRecognition = (options?: {
	onFinalResult?: (transcript: string) => void;
	onInterimResult?: (transcript: string) => void;
}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [transcript, setTranscript] = useState<string>("");
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	useEffect(() => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		if (SpeechRecognition) {
			recognitionRef.current = new SpeechRecognition();

			recognitionRef.current.lang = "ja-JP";
			recognitionRef.current.continuous = true;
			recognitionRef.current.interimResults = true;

			recognitionRef.current.onstart = () => setIsRecording(true);
			recognitionRef.current.onend = (e) => {
				console.log("onend", e);
				setIsRecording(false);
			};
			recognitionRef.current.onerror = (e) => {
				console.error("error", e);
				setIsRecording(false);
			};
		}

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.onstart = null;
				recognitionRef.current.onend = null;
				recognitionRef.current.onerror = null;
			}
		};
	}, []);

	const toggleRecording = () => {
		if (recognitionRef.current) {
			if (isRecording) {
				recognitionRef.current.stop();
			} else {
				recognitionRef.current.start();
			}
		}
	};

	useEffect(() => {
		if (!recognitionRef.current) return;
		recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
			const results = event.results;
			for (let i = event.resultIndex; i < results.length; i++) {
				const v = results[i][0].transcript;
				const isFinal = results[i].isFinal;
				console.log({ v, isFinal });
				if (isFinal) {
					if (!v.trim()) {
						continue;
					}
					setTranscript(v);
					options?.onFinalResult?.(v);
					setTranscript("");
				} else {
					setTranscript(v);
					options?.onInterimResult?.(v);
				}
			}
		};
	}, [options]);

	return {
		isRecording,
		transcript,
		toggleRecording,
		start: () => recognitionRef.current?.start(),
		stop: () => recognitionRef.current?.stop(),
	};
};
