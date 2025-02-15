"use client";

import { IFollowers, IPost } from "@/interface/social";
import apiConfig from "@/utils/axiosConfig";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface followProps {
	userId: string | undefined;
	userType: "users" | "business";
	initialData: IFollowers;
	followUserId: string;
	username?: string;
	displayName?: string;
}

const useUserPosts = ({ userId }: { userId: string }) => {
	const query = useInfiniteQuery<{
		nextCursor: null | number;
		hasNextPage: Boolean;
		posts: IPost;
	}>({
		queryKey: ["post-feed", "for-you", userId],
		queryFn: async ({ pageParam = null }) => {
			const searchParams = new URLSearchParams();
			if (pageParam) {
				searchParams.append("cursor", pageParam as unknown as string);
			}

			const response = await apiConfig.get(`/api/post`, {
				params: {
					userId,
				},
			});

			return response.data;
		},
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? lastPage.nextCursor : undefined,
		initialPageParam: null as string | null,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	return query;
};
export default useUserPosts;
