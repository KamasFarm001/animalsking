"use client";

import useFollowerInfo, { followProps } from "@/hooks/useFollowerInfo";
import { Button } from "../ui/button";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import apiConfig from "@/utils/axiosConfig";
import { IFollowers } from "@/interface/social";
import { toast as sonnerToast } from "sonner";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";
import UnauthorizedModal from "../UnauthorizedModal";

const FollowButton = ({
	userId,
	initialData,
	followUserId,
	username,
	userType,
	displayName,
}: followProps) => {
	const { data, isLoading, refetch } = useFollowerInfo({
		userType,
		userId,
		initialData,
		followUserId,
	});
	const queryClient = useQueryClient();
	const queryKey: QueryKey = ["followerInfo", userId, followUserId];
	const session = useSession();

	const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

	const { mutate } = useMutation({
		mutationFn: async () => {
			const response = data.isFollowedByUser
				? await apiConfig.delete(
						`/api/${userType}/${userId}/followers`,

						{ params: { unfollowUserId: followUserId } }
				  )
				: await apiConfig.post(`/api/${userType}/${userId}/followers`, null, {
						params: { followUserId },
				  });

			return response.data;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey });
			const prevState = queryClient.getQueryData<IFollowers>(queryKey);
			if (!prevState) return { prevState: null };

			const newState: IFollowers = {
				followers: prevState.followers,
				following: prevState.following,
				followersCount:
					prevState.followersCount + (prevState.isFollowedByUser ? -1 : 1),
				followingCount:
					prevState.followingCount + (prevState.isFollowingUser ? 1 : -1),
				isFollowedByUser: !prevState.isFollowedByUser,
				isFollowingUser: !prevState.isFollowingUser,
			};

			queryClient.setQueryData<IFollowers>(queryKey, newState);

			return { prevState };
		},
		onSuccess: async (newData) => {
			// Update with the actual server data
			queryClient.setQueryData<IFollowers>(queryKey, newData);
			await queryClient.invalidateQueries({ queryKey: ["followerInfo"] });
			await queryClient.refetchQueries({ queryKey: ["userType"] });
			await refetch();

			sonnerToast(
				newData.isFollowedByUser
					? `New Follow ${displayName && "@" + displayName}`
					: `UnFollowed ${displayName && "@" + displayName}`,
				{
					duration: 5000,

					description: `You just ${
						newData.isFollowedByUser ? "followed" : "unFollowed"
					} ${username}`,
				}
			);
		},
		onError(error, variables, context) {
			if (context?.prevState) {
				queryClient.setQueryData(queryKey, context?.prevState);
			}
			console.log(error);
			toast({
				variant: "destructive",
				description: "something went wrong. please try again",
			});
		},
		onSettled: () => {
			// Refetch to ensure server and client state are in sync
			queryClient.invalidateQueries({ queryKey });
		},
	});

	if (!data) return null;

	return (
		<>
			<Button
				onClick={() => {
					if (!session?.data?.user || !session) {
						setShowUnauthorizedModal(true);
					} else {
						mutate();
					}
				}}
				variant={data.isFollowedByUser ? "outline" : "default"}
				className="text-white"
			>
				{isLoading
					? "Loading..."
					: data.isFollowedByUser
					? "Unfollow"
					: "Follow"}
			</Button>
			<UnauthorizedModal
				showUnauthorizedModal={showUnauthorizedModal}
				setShowUnauthorizedModal={setShowUnauthorizedModal}
			/>
		</>
	);
};

export default FollowButton;
