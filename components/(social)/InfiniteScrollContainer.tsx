"use client";

import { cn } from "@/utils/utils";
import { ClassValue } from "clsx";
import React from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
	onBottomReached: () => void;
	className?: ClassValue;
}

const InfiniteScrollContainer = ({
	children,
	onBottomReached,
	className,
}: InfiniteScrollContainerProps) => {
	const { ref } = useInView({
		rootMargin: "200px",
		onChange(inView) {
			if (inView) {
				onBottomReached();
			}
		},
	});
	return (
		<div className={cn(className)}>
			{children}
			<div ref={ref} />
		</div>
	);
};

export default InfiniteScrollContainer;
