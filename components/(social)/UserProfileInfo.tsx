"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { IFollowers, IPost } from "@/interface/social";
import apiConfig from "@/utils/axiosConfig";
import { formatNumber } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import Link from "next/link";

const UserProfileInfo = ({
	initialState,
	id,
	createdAt,
	username,
	userType,
	followUserId,
}: {
	initialState: IFollowers;
	id: string | undefined;
	createdAt: string;
	username: string;
	userType: "users" | "business";
	followUserId: string;
}) => {
	const { data } = useFollowerInfo({
		userId: id,
		initialData: initialState,
		userType,
		username,
		followUserId,
	});

	const { data: postCount } = useQuery<IPost>({
		queryKey: ["postCounts", userType, id, followUserId],
		queryFn: async () => {
			const response = await apiConfig.get(`/api/${userType}/${id}/followers`, {
				params: {
					getFollowedByAndCount: true,
					followId: followUserId,
				},
			});
			return response.data;
		},
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});

	return (
		<>
			<div className="mt-3">
				Member since{" "}
				<span className="font-semibold text-muted-foreground">
					{formatDate(createdAt, "MMM d,yyyy")}
				</span>
			</div>
			<div className="flex items-center gap-3">
				<span>
					Posts:{" "}
					<span className="font-semibold text-muted-foreground">
						{formatNumber(postCount?.postCount || 0)}
					</span>
				</span>
				<Link
					href={`/users/${id}/followers`}
					className="text-primary hover:underline"
				>
					Followers:{" "}
					<span className="font-semibold ">
						{formatNumber(data.followersCount || 0)}
					</span>
				</Link>
				<Link
					href={`/users/${id}/following`}
					className="text-primary hover:underline"
				>
					Following:{" "}
					<span className="font-semibold ">
						{formatNumber(data.followingCount || 0)}
					</span>
				</Link>
			</div>
		</>
	);
};

export default UserProfileInfo;
