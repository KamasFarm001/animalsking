"use client";

import InfiniteScrollContainer from "@/components/(social)/InfiniteScrollContainer";
import { CircularLoader } from "@/components/Loader";
import Post from "@/components/(social)/Post";
import { Skeleton } from "@/components/ui/skeleton";
import { IPost, IPostPage } from "@/interface/social";
import apiConfig from "@/utils/axiosConfig";
import { useInfiniteQuery } from "@tanstack/react-query";

const ForYouFeed = () => {
	const {
		status,
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	} = useInfiniteQuery<IPostPage>({
		queryKey: ["post-feed", "for-you"],
		queryFn: async ({ pageParam = null }) => {
			const searchParams = new URLSearchParams();
			if (pageParam) {
				searchParams.append("cursor", pageParam as unknown as string);
			}
			const response = await apiConfig.get("/api/post", {
				params: { cursor: pageParam },
			});
			return response.data;
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? lastPage.nextCursor : undefined,
		initialPageParam: null as string | null,
		staleTime: Infinity,
	});

	const posts = data?.pages.flatMap((page) => page.posts) ?? [];

	if (status === "pending") {
		return (
			<div className="flex flex-col space-y-6">
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
		);
	}

	if (status === "success" && !Post.length && !hasNextPage) {
		return (
			<p className="text-center text-muted-foreground">
				No one has posted anything yet!
			</p>
		);
	}

	if (status === "error") {
		return (
			<p className="text-center text-destructive">
				An error occurred while loading posts
			</p>
		);
	}
	return (
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
	);
};

export default ForYouFeed;
