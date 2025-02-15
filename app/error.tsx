"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Optionally log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<main className="flex h-screen bg-green-darker text-foreground flex-col items-center justify-center">
			<h2 className="text-center text-xl">Something went wrong!</h2>
			{/* <p className="text-destructive">{error.name}</p> */}
			<p className="text-destructive">{error.message}</p>

			<Button
				onClick={
					// Attempt to recover by trying to re-render the route
					() => reset()
				}
				className="mt-5 bg-primary hover:bg-primary/70 active:bg-primary/90 flex gap-4 transition-colors text-white"
				type="button"
			>
				Try again
			</Button>
		</main>
	);
}
