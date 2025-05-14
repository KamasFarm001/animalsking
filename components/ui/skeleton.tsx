import { cn } from "@/utils/utils";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-md bg-primary/25 dark:bg-secondary/70",
				className
			)}
			{...props}
		/>
	);
}

export { Skeleton };
