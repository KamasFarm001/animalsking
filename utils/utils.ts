import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNowStrict } from "date-fns";
import { MutableRefObject, Ref } from "react";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatRelativeDate = (from: Date) => {
	const date = new Date(from);
	if (!date) {
		return;
	} else {
		const currentDate = new Date();
		if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
			return formatDistanceToNowStrict(date, { addSuffix: true });
		} else {
			if (currentDate.getFullYear() === date.getFullYear()) {
				return format(date, "MMM d");
			} else {
				return format(date, "MMM d yyyy");
			}
		}
	}
};

export const generateAbbr = (value: string) => {
	if (!value) return;
	const words = value?.split(" ");
	const initials = words?.map((word) => word.charAt(0));
	return initials?.join("").toUpperCase();
};

export const formatNumber = (n: number): string => {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(n);
};

export const hashtagsRegex = /(^|\s)(#[a-zA-Z0-9]+)/g;
export const atUserRegex = /(\B@[a-zA-Z0-9_-]+)/g;
export const urlRegex = /(https?:\/\/[^\s]+)/g;

export const extractHashtags = (text: string): string[] => {
	return (
		text
			.split(hashtagsRegex)
			.filter((text) => text.match(hashtagsRegex))
			.filter(Boolean) || []
	);
};

export const AddToSelectionRange = (
	ref: MutableRefObject<HTMLDivElement | null>,
	textToPlace?: string
) => {
	//Feat: places emoji to the cursor position.
	if (!ref?.current) return;
	const selection = window.getSelection()!;
	if (selection?.rangeCount === 0) return;
	let currentRange = selection?.getRangeAt(0)!;

	if (document.activeElement !== ref?.current) {
		ref?.current.focus();
		currentRange = document.createRange();
		currentRange.selectNodeContents(ref?.current);
		currentRange.collapse(false);
		selection?.removeAllRanges();
		selection?.addRange(currentRange);
	}
	if (textToPlace) {
		const emojiNode = document.createTextNode(textToPlace);
		currentRange?.insertNode(emojiNode);

		//move curser to the end of the inserted emoji;
		currentRange?.setStartAfter(emojiNode);
		currentRange?.collapse(true);
		selection?.removeAllRanges();
		selection?.addRange(currentRange);
	} else {
		currentRange?.collapse(true);
		selection?.removeAllRanges();
		selection?.addRange(currentRange);
	}
};
