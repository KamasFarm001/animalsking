"use client";
import InfiniteScrollContainer from "./InfiniteScrollContainer";
import { IPost } from "@/interface/social";
import { CircularLoader } from "../Loader";
import useUserPosts from "@/hooks/userPosts";
import Post from "./Post";
import { Skeleton } from "../ui/skeleton";

const UserPosts = ({
	username,
	userId,
}: {
	username: string;
	userId: string;
}) => {
	const {
		data,
		fetchNextPage,
		isFetching,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useUserPosts({
		userId,
	});
	const posts = data?.pages.flatMap((page) => page.posts) ?? [];

	if (status === "pending") {
		return (
			<>
				<h2 className="text-center text-2xl font-semibold my-3 dark:shadow-none shadow-shadow-color dark:border bg-card rounded-sm py-3">
					{username.at(-1)?.toLowerCase() === "s"
						? (username as any) + "' "
						: (username as any) + "'s "}
					Posts
				</h2>
				<div className="flex flex-col space-y-6 mt-5">
					{Array.from({ length: 8 }).map((_, index) => {
						return (
							<div
								key={`skeleton-${index}-${Math.random()
									.toString(36)
									.substring(7)}`}
								className="flex items-start w-full space-x-4"
							>
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
						);
					})}
				</div>
			</>
		);
	}

	if (status === "error") {
		return (
			<>
				<h2 className="text-center text-2xl font-semibold my-3 dark:shadow-none shadow-shadow-color dark:border bg-card rounded-sm py-3">
					{username.at(-1)?.toLowerCase() === "s"
						? (username as any) + "' "
						: (username as any) + "'s "}
					Posts
				</h2>
				<p className="text-center text-destructive">
					An error occurred while loading posts
				</p>
			</>
		);
	}

	if (status === "success" && !posts.length && !hasNextPage) {
		return (
			<>
				<h2 className="text-center text-2xl font-semibold my-3 dark:shadow-none shadow-shadow-color dark:border bg-card rounded-sm py-3">
					{username.at(-1)?.toLowerCase() === "s"
						? (username as any) + "' "
						: (username as any) + "'s "}{" "}
					Posts
				</h2>
				<p className="text-center text-muted-foreground">
					{username} has not posted anything yet!
				</p>
			</>
		);
	}

	return (
		<>
			<h2 className="text-center text-2xl font-semibold my-3 dark:shadow-none shadow-shadow-color dark:border bg-card rounded-sm py-3">
				{username.at(-1)?.toLowerCase() === "s"
					? (username as any) + "' "
					: (username as any) + "'s "}
				Posts
			</h2>
			<InfiniteScrollContainer
				onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
				className="space-y-5"
			>
				{posts.map((post: IPost) => {
					return (
						<>
							<Post key={post?._id} {...post} />
						</>
					);
				})}
				{isFetchingNextPage && <CircularLoader className="my-3 mx-auto" />}
			</InfiniteScrollContainer>
		</>
	);
};

export default UserPosts;
