"use client";

import {
	InfiniteData,
	QueryFilters,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { createPost, DeletePost } from "@/actions/socialActions";
import { formatDate } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { toast as sonnerToast } from "sonner";
import { IPost, IPostPage } from "@/interface/social";

const queryFilter: QueryFilters = {
	queryKey: ["post-feed", "for-you"],
};
export const useSubmitPostMutation = () => {
	const { toast } = useToast();
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: createPost,

		onSuccess: async (data) => {
			const processedFormData = JSON.parse(data);
			// Update the cache with new post
			queryClient.setQueriesData<InfiniteData<IPostPage, string | null>>(
				queryFilter,
				(oldData) => {
					if (!oldData) return oldData;
					const firstPage = oldData?.pages[0];
					if (!firstPage) return oldData;

					return {
						...oldData,
						pageParams: oldData.pageParams,
						pages: [
							{
								posts: [processedFormData?.data?.newPost, ...firstPage.posts],
								nextCursor: firstPage.nextCursor,
							},
							...oldData.pages.slice(1),
						],
					};
				}
			);

			await queryClient.invalidateQueries({
				queryKey: ["post-feed", "for-you"],
				stale: false,
				refetchType: "active",
			});

			sonnerToast("Your post has been created.", {
				duration: 5000,
				description: formatDate(
					processedFormData?.data?.newPost?.createdAt,
					"EEEE,MMMM dd,yyyy 'at' h:mm a"
				),
				action: {
					label: "View",
					onClick: () =>
						router.push(`/posts/${processedFormData?.data?.newPost?._id}`),
				},
			});
		},
		onError(error) {
			console.log(error);
			toast({
				className: "left-0",
				variant: "destructive",
				description: "Failed to create post. please try again.",
			});
		},
	});

	return mutation;
};

export const useDeletePostMutation = () => {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const router = useRouter();
	const pathname = usePathname();

	const mutation = useMutation({
		mutationFn: DeletePost,
		onSuccess: async (data) => {
			const processedFormData = JSON.parse(data);
			if (processedFormData.success) {
				const queryFilter: QueryFilters = {
					queryKey: ["post-feed", "for-you"],
				};

				// Update cache to remove deleted post
				queryClient.setQueriesData<InfiniteData<IPostPage, string | null>>(
					queryFilter,
					(oldData) => {
						if (!oldData) return oldData;
						return {
							...oldData,
							pageParams: oldData.pageParams,
							pages: oldData.pages.map((page) => ({
								...page,
								posts: page.posts.filter(
									(p: IPost) =>
										p._id !== processedFormData?.data?.deletedUserPost._id
								),
								nextCursor: page.nextCursor,
							})),
						};
					}
				);

				// Mark queries as stale without forcing an immediate refetch
				await queryClient.invalidateQueries({
					queryKey: ["post-feed", "for-you"],
					refetchType: "none",
				});
				await queryClient.invalidateQueries({
					queryKey: ["postCounts"],
				});

				sonnerToast("Your post has been deleted.", {
					duration: 5000,
					description: formatDate(
						processedFormData?.data?.deletedUserPost?.createdAt,
						"EEEE,MMMM dd,yyyy 'at' h:mm a"
					),
				});

				if (
					pathname === `/post/${processedFormData?.data?.deletedUserPost?._id}`
				) {
					router.push("/");
				}
			} else {
				toast({
					className: "left-0",
					variant: "destructive",
					description: processedFormData.data,
				});
			}
		},
		onError(error) {
			console.log(error.message);
			toast({
				className: "left-0",
				variant: "destructive",
				description: "Failed to delete post. please try again.",
			});
		},
	});
	return mutation;
};
