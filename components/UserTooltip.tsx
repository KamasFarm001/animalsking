"use client";

import { IPost, IUser } from "@/interface/social";
import { PropsWithChildren } from "react";
import FollowButton from "@/components/(social)/FollowButton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber, generateAbbr } from "@/utils/utils";
import apiConfig from "@/utils/axiosConfig";
import { useQuery } from "@tanstack/react-query";

interface userTooltipProps extends PropsWithChildren {
	children: React.ReactNode;
	user: IPost["author"];
	sessionId: string | undefined;
}

const UserTooltip = ({ children, user, sessionId }: userTooltipProps) => {
	const { data: userType } = useQuery({
		queryKey: ["userType", user._id!],
		queryFn: async () => {
			const userResponse = await apiConfig.get(`/api/users/${user._id}`);
			const userDataResponse = userResponse.data.user as IUser;
			const userInfo = {
				...userDataResponse,
				accountType:
					userDataResponse.accountType == "personal"
						? "users"
						: userDataResponse.accountType,
			};
			return userInfo;
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="bg-card w-72 shadow-sm left-10 mx-5 dark:shadow-none shadow-shadow-color dark:border ">
					<div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
						<div className="flex items-center justify-between gap-2">
							<div className="flex md:items-center gap-2">
								<Link href={`/users/${user?.username}`}>
									<Avatar className="size-14 mb-auto bg-background">
										<AvatarImage
											src={user?.avatarUrl}
											alt={user?.username}
											className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
										/>
										<AvatarFallback className="text-sm text-white border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
											{generateAbbr(user?.username || "AK")}
										</AvatarFallback>
									</Avatar>
								</Link>
								<div>
									<Link
										href={`/users/${user._id}`}
										className="flex hover:underline items-center gap-2 scroll-m-20 text-md font-medium tracking-tight"
									>
										<h2 className="text-lg text-primary line-clamp-1 break-all font-semibold">
											{user?.username}
										</h2>
									</Link>
									<Link
										href={`/users/${user._id}`}
										className="text-md mb-2 block w-full line-clamp-1 break-all font-normal text-muted-foreground leading-none"
									>
										@{user.displayName || "iamFarmer"}
									</Link>
									{
										<span className="text-xs font-medium text-muted-foreground">
											Followers:{" "}
											{formatNumber(userType?.followers?.length || 0)}
										</span>
									}
								</div>
							</div>
							{sessionId !== user._id && (
								<FollowButton
									followUserId={user?._id}
									username={user?.username}
									displayName={user?.displayName}
									initialData={{
										followers: user.followers,
										following: user.following,
										followersCount: user?.followersCount?.length,
										followingCount: user?.followingCount?.length,
										isFollowedByUser: user?.followers?.includes(sessionId!),
										isFollowingUser: user?.following?.includes(sessionId!),
									}}
									userType={
										userType?.accountType! as "personal" | "business" | "users"
									}
									userId={sessionId}
								/>
							)}
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default UserTooltip;
