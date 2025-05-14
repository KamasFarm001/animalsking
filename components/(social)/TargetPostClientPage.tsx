"use client";

import { getPost } from "@/actions/socialActions";
import Post from "@/components/(social)/Post";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const Page = ({ postId }: { postId: string }) => {
	const session = useSession();

	const { data, status } = useQuery({
		queryKey: ["post", postId, session?.data?.user.id],
		queryFn: async () =>
			await getPost({
				postId: postId,
				userId: session?.data?.user.id!,
			}),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	if (status === "pending") {
		return (
			<main className="flex-[5] mb-5 relative top-3 my-max px-5 md:px-0 lg:px-5 min-h-screen">
				<div className="flex flex-col space-y-6">
					<div className="flex items-start w-full space-x-4">
						<Skeleton className="size-12 aspect-square rounded-full" />
						<div className="space-y-2 w-full">
							<div className="flex items-center justify-between gap-5">
								<Skeleton className="h-4 w-[300px]" />
								<Skeleton className="h-4 w-[30px]" />
							</div>
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-[140px] w-full rounded-xl" />
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (status === "error") {
		return (
			<p className="text-center text-destructive">
				An error occurred while loading post
			</p>
		);
	}

	const post = JSON.parse(data!)?.data.post;
	return (
		<>
			<main className="flex-[5] mb-5 relative top-3 my-max px-5 md:px-0 lg:px-5 min-h-screen">
				<>
					<Post key={post?._id} {...post} />
				</>
			</main>
		</>
	);
};

export default Page;
