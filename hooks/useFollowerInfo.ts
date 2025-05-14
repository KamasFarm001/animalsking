"use client";

import { IFollowers } from "@/interface/social";
import apiConfig from "@/utils/axiosConfig";
import { useQuery } from "@tanstack/react-query";

export interface followProps {
	userId: string | undefined;
	userType: "users" | "business" | "personal";
	initialData: IFollowers;
	followUserId: string;
	username?: string;
	displayName?: string;
}

const useFollowerInfo = ({
	userId,
	initialData,
	userType,
	followUserId,
}: followProps) => {
	const query = useQuery<IFollowers>({
		queryKey: ["followerInfo", userType, userId, followUserId],
		queryFn: async () => {
			const response = await apiConfig.get(
				`/api/${userType}/${userId}/followers`,
				{
					params: {
						getFollowedByAndCount: true,
						followId: followUserId,
					},
				}
			);
			return response.data;
		},
		initialData,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	return query;
};
export default useFollowerInfo;
