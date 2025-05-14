import { cn } from "@/utils/utils";
import { ClassValue } from "class-variance-authority/types";
import React from "react";

export const Loader = ({ className }: { className?: ClassValue }) => {
	return (
		<div className={cn("w-6 h-6 text-white", className)}>
			<svg className="animate-spin duration-1000" viewBox="0 0 24 24">
				{[...Array(12)].map((_, i) => (
					<rect
						key={i}
						x="11"
						y="1"
						width="2"
						height="5"
						rx="1"
						transform={`rotate(${i * 30} 12 12)`}
						opacity={1 - (i * 0.75) / 12}
						className="fill-current"
					/>
				))}
			</svg>
		</div>
	);
};

export const CircularLoader = ({ className }: { className?: ClassValue }) => {
	return (
		<div
			className={cn(
				"w-7 h-7 relative inset-0 flex items-center justify-center text-white",
				className
			)}
		>
			<svg className="animate-spin" viewBox="25 25 50 50">
				<circle
					className={`stroke-current`}
					cx="50"
					cy="50"
					r="20"
					fill="none"
					strokeWidth="3"
					strokeDasharray="150,200"
					strokeDashoffset="-10"
					strokeLinecap="round"
				>
					<animate
						attributeName="stroke-dasharray"
						dur="1.5s"
						repeatCount="indefinite"
						values="1,200;89,200;89,200"
						keyTimes="0;0.5;1"
					/>
					<animate
						attributeName="stroke-dashoffset"
						dur="1.5s"
						repeatCount="indefinite"
						values="0;-35;-124"
						keyTimes="0;0.5;1"
					/>
				</circle>
			</svg>
		</div>
	);
};
