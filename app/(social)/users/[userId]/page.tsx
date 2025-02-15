import { options } from "@/app/api/auth/[...nextauth]/options";
import ProfileModal from "@/components/(social)/DiaglogModal";
import FollowButton from "@/components/(social)/FollowButton";
import TrendsSidebar from "@/components/(social)/TrendsSidebar";
import UserPosts from "@/components/(social)/UserPosts";
import UserProfileInfo from "@/components/(social)/UserProfileInfo";
import Linkify from "@/components/Linkify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IFollowers, IUser } from "@/interface/social";
import { generateAbbr } from "@/utils/utils";
import apiConfig from "@/utils/axiosConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const generateMetadata = async ({
	params,
}: {
	params: { userId: string };
}): Promise<Metadata> => {
	const user = await apiConfig.get(`/api/users/${params.userId}`);
	return {
		title: `${user?.data.user.displayName ?? ""} @${user?.data.user.username}`,
	};
};
const Page = async ({ params }: { params: { userId: string } }) => {
	const userResponse = await apiConfig.get(`/api/users/${params.userId}`);
	const user = userResponse.data.user as IUser;
	const session = await getServerSession(options);

	const initialState: IFollowers = {
		followersCount: user.followers.length,
		followingCount: user.following.length,
		following: user.following,
		followers: user.followers,
		isFollowedByUser: user.followers.includes(session?.user.id!),
		isFollowingUser: user.following.includes(session?.user.id!),
	};

	return (
		<>
			<article className="flex-[5] min-h-screen w-full relative top-3">
				<div className="flex h-fit items-center rounded-sm flex-col p-5 w-full gap-5 justify-center shadow-sm dark:shadow-none shadow-shadow-color dark:border bg-card">
					<div className=" mb-2 flex-col flex gap-2 items-center">
						<div className="flex gap-4 items-center">
							<Avatar className="size-52">
								<AvatarImage
									src={user?.avatarUrl}
									alt={user?.displayName || user?.username}
									className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
								/>
								<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
									{generateAbbr(user?.username!)}
								</AvatarFallback>
							</Avatar>
						</div>
					</div>
					<div className="max-w-xl w-full">
						<div className="flex items-center gap-2 justify-between scroll-m-20 text-md font-medium tracking-tight">
							<div className="flex flex-col">
								<p className="font-semibold text-xl">{user?.username}</p>
								{user.displayName && (
									<p className="font-semibold block text-muted-foreground text-sm w-full">
										@{user?.displayName}
									</p>
								)}
							</div>

							{user?._id == session?.user.id ? (
								<ProfileModal />
							) : (
								<FollowButton
									userType={
										user.accountType == "personal" ? "users" : user.accountType
									}
									followUserId={user._id}
									username={user.username}
									displayName={user.displayName}
									initialData={initialState}
									userId={session?.user.id}
								/>
							)}
						</div>
						<UserProfileInfo
							createdAt={user.createdAt}
							followUserId={user._id}
							id={session?.user.id}
							initialState={initialState}
							userType={
								user.accountType === "personal" ? "users" : user.accountType
							}
							username={user.username}
						/>
						{user.bio && (
							<>
								<hr />
								<Linkify userId={user._id}>
									<div className="overflow-hidden whitespace-pre-line break-words">
										{user.bio}
									</div>
								</Linkify>
							</>
						)}
					</div>
				</div>
				<UserPosts userId={params?.userId} username={user?.username} />
			</article>
			<TrendsSidebar />
		</>
	);
};

export default Page;
