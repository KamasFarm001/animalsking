"use client";

import { atUserRegex, cn, hashtagsRegex, urlRegex } from "@/utils/utils";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { postDataType } from "./PostAContent";

const PostInput = ({
	form,
	onSubmit,
	editorRef,
	defaultContent,
	disabled,
}: {
	onSubmit: (data: postDataType) => void;
	editorRef: MutableRefObject<HTMLDivElement | null>;
	disabled: boolean;
	form: UseFormReturn<
		{
			postText: string;
		},
		any,
		undefined
	>;
	defaultContent?: string;
}) => {
	const [isMobile, setIsMobile] = useState(false);

	const setCaretPosition = useCallback(
		(element: HTMLElement, position: number) => {
			const range = document.createRange();
			const selection = window.getSelection();
			let currentPos = 0;

			function traverseNodes(node: Node): boolean {
				if (node.nodeType === Node.TEXT_NODE) {
					const nodeLength = node.textContent?.length || 0;
					if (currentPos <= position && position <= currentPos + nodeLength) {
						range.setStart(node, position - currentPos);
						range.collapse(true);
						selection?.removeAllRanges();
						selection?.addRange(range);
						return true;
					}
					currentPos += nodeLength;
				} else {
					for (const childNode of Array.from(node.childNodes)) {
						if (traverseNodes(childNode)) return true;
					}
				}
				return false;
			}

			traverseNodes(element);
			element.focus();
		},
		[]
	);

	const formatHashTags = (text: string): string => {
		if (!text) return "";

		// Handle URLs
		text = text.replace(
			urlRegex,
			`<a href="$1" target="_blank" rel="noopener noreferrer" class="text-emerald-600 font-semibold hover:underline">$1</a>`
		);

		// Handle hashtags
		text = text.replace(
			hashtagsRegex,
			(match, p1, p2) =>
				`${p1}<span class="underline text-emerald-600 font-semibold">${p2.toLowerCase()}</span>`
			// `$1<span class="underline text-emerald-600 font-semibold">$2</span>`
		);

		// Handle @ mentions
		text = text.replace(
			atUserRegex,
			`<span class="underline text-emerald-600 font-semibold">$1</span>`
		);

		// Run linkify after processing hashtags and mentions
		return text;
	};

	const getCaretPosition = (element: HTMLElement) => {
		const selection = window.getSelection();
		if (!selection?.rangeCount) return 0;

		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		return preCaretRange.toString().length;
	};

	const handleInput = useCallback(() => {
		if (!editorRef.current) return;

		const text = editorRef.current.innerText;
		const caretPosition = getCaretPosition(editorRef.current);

		form.setValue("postText", text.trim(), { shouldDirty: true });

		const formattedContent = formatHashTags(text);
		editorRef.current.innerHTML = formattedContent;

		setCaretPosition(editorRef.current, caretPosition);
	}, [editorRef, form, setCaretPosition]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			e.stopPropagation();

			if (e.key === "Enter") {
				if (isMobile || e.shiftKey) {
					e.preventDefault();

					const selection = window.getSelection();
					if (!selection?.rangeCount || !editorRef.current) return;

					const range = selection.getRangeAt(0);
					range.deleteContents();

					const newlineNode = document.createTextNode("\n");
					const br = document.createElement("br");
					range.insertNode(newlineNode);
					range.insertNode(br);

					range.setStartAfter(newlineNode);
					range.setEndAfter(newlineNode);
					selection.removeAllRanges();
					selection.addRange(range);

					if (editorRef.current.scrollHeight > editorRef.current.clientHeight) {
						editorRef.current.scrollTop = editorRef.current.scrollHeight;
					}

					handleInput();
				} else if (onSubmit) {
					e.preventDefault();
					if (!disabled) {
						onSubmit(form.getValues());
					}
				}
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				// undo();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "y") {
				e.preventDefault();
				// redo();
			}
		},
		[disabled, editorRef, form, handleInput, isMobile, onSubmit]
	);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (!editorRef.current) return;

			const text = e.clipboardData.getData("text/plain");
			const selection = window.getSelection();
			if (!selection?.rangeCount) return;

			const range = selection.getRangeAt(0);
			range.deleteContents();
			const textNode = document.createTextNode(text);
			range.insertNode(textNode);

			range.setStartAfter(textNode);
			range.setEndAfter(textNode);
			selection.removeAllRanges();
			selection.addRange(range);

			handleInput();
		},
		[editorRef, handleInput]
	);

	// Initialize state with default content
	useEffect(() => {
		if (editorRef.current && defaultContent) {
			const formattedContent = formatHashTags(defaultContent);
			editorRef.current.innerHTML = formattedContent;
			form.setValue("postText", defaultContent, { shouldDirty: true });

			const delayFocus = setTimeout(() => {
				if (editorRef.current) {
					const range = document.createRange();
					const selection = window.getSelection();
					range.selectNodeContents(editorRef.current);
					range.collapse(false);
					selection?.removeAllRanges();
					selection?.addRange(range);
					editorRef.current.focus();
				}
			}, 100);

			return () => {
				clearTimeout(delayFocus);
			};
		}
	}, [defaultContent, editorRef, form]);

	// Check for mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				)
			);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div
			ref={editorRef}
			contentEditable
			className={cn(
				"max-w-full overflow-y-auto break-all whitespace-pre-wrap outline-none min-h-16 max-h-52 py-5 text-md w-full dark:focus-visible:ring-transparent relative before:content-[attr(data-placeholder)] before:text-muted-foreground before:absolute before:left-0 before:top-5 before:pointer-events-none before:transition-opacity before:opacity-0 focus-visible:ring-transparent border-none shadow-none rounded-lg",
				{
					"before:opacity-100": !form.formState.isDirty,
				}
			)}
			role="textbox"
			onInput={handleInput}
			onPaste={handlePaste}
			onKeyDown={handleKeyDown}
			aria-multiline="true"
			tabIndex={0}
			suppressContentEditableWarning={true}
			data-placeholder="What's on your mind today?"
			aria-label="What's on your mind today?"
		/>
	);
};
export default PostInput;
