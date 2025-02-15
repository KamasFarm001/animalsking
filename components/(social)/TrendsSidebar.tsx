import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import apiConfig from "@/utils/axiosConfig";
import { cn, formatNumber, generateAbbr } from "@/utils/utils";
import { IUser } from "@/interface/social";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import FollowButton from "./FollowButton";
import { ClassValue } from "clsx";

const WhoToFollow = async () => {
	const session = await getServerSession(options);

	const users = await apiConfig.get(`/api/users`, {
		params: {
			userId: session?.user?.id,
			projections: {
				username: 1,
				followers: 1,
				following: 1,
				avatarUrl: 1,
				displayName: 1,
				accountType: 1,
				followersCount: 1,
				followingCount: 1,
			},
			limit: 5,
			userIdToExclude: session?.user?.id,
		},
	});

	if (!session || !session.user) {
		return;
	}
	return (
		users?.data?.users?.length >= 1 && (
			<div className="bg-card shadow-sm dark:shadow-none shadow-shadow-color dark:border rounded-md p-3 h-fit lg:mr-5">
				<h2 className="px-3 font-semibold text-lg mb-3">Who to follow</h2>
				<ul>
					{users?.data?.users?.map((user: IUser) => (
						<li
							key={user._id}
							className="px-3 flex gap-5 items-center justify-between"
						>
							<div className=" mb-2 flex gap-2 items-center">
								<div className="flex gap-4 items-center  ">
									<Avatar className="size-12">
										<AvatarImage
											src=""
											alt=""
											className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
										/>
										<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
											{generateAbbr(session?.user.username || "AK")}
										</AvatarFallback>
									</Avatar>
								</div>
								<div>
									<Link
										href={`/users/${user._id}`}
										className="line-clamp-1 cursor-pointer break-all scroll-m-20 text-md font-medium hover:underline tracking-tight first:mt-0"
									>
										{user?.username}
									</Link>
									<small className="text-sm line-clamp-1 break-all font-normal text-muted-foreground leading-none">
										@{user.displayName || "iamFarmer"}
									</small>
								</div>
							</div>
							<FollowButton
								followUserId={user._id}
								username={user.username}
								displayName={user.displayName}
								initialData={{
									followers: user.followers,
									following: user.following,
									followersCount: user?.followers?.length,
									followingCount: user?.following?.length,
									isFollowedByUser: user?.followers?.includes(session.user.id),
									isFollowingUser: user?.following?.includes(session.user.id),
								}}
								userId={session?.user.id}
								userType={
									user.accountType == "personal" ? "users" : user.accountType
								}
							/>
						</li>
					))}
				</ul>
			</div>
		)
	);
};

const getTrendingTopics = unstable_cache(
	async () => {
		const results = await apiConfig.get("/api/hashtags");
		return results.data;
	},
	["trending_topics"],
	{
		revalidate: 2 * 60 * 60,
		tags: ["hashtags"],
	}
);

const TrendingHashTags = async () => {
	const trendingTopics = await getTrendingTopics();
	// await new Promise((r) => setTimeout(r, 3000)); //testing

	return (
		trendingTopics.topHashTags.length >= 1 && (
			<div className="bg-card shadow-sm dark:shadow-none shadow-shadow-color dark:border rounded-md p-3 h-fit lg:mr-5">
				<h2 className="px-3 font-semibold text-lg mb-2">Trending HashTags</h2>
				<ul className=" flex flex-col gap-5 px-3">
					{trendingTopics.topHashTags
						.sort(
							(
								a: { count: number; hashtag: string },
								b: { count: number; hashtag: string }
							) => b.count - a.count
						)
						?.map(({ hashtag, count }: { hashtag: string; count: number }) => {
							const title = hashtag.split("#")[1];

							return (
								<li key={title} className="w-fit ">
									<Link
										href={`/hashtags/${title}`}
										className="text-emerald-600 flex flex-col line-clamp-1 break-all text-lg font-semibold"
									>
										<p className="hover:underline">{hashtag}</p>
										<p className="text-sm font-medium text-muted-foreground">
											{formatNumber(count)} {count === 1 ? "post" : "posts"}
										</p>
									</Link>
								</li>
							);
						})}
				</ul>
			</div>
			// )
		)
	);
};

const TrendsSidebar = ({ className }: { className?: ClassValue }) => {
	return (
		<aside
			className={cn(
				"hidden w-full md:flex flex-col gap-5 sticky top-[5.3rem] mb-7 h-fit flex-[3]",
				className
			)}
		>
			<Suspense
				fallback={
					<div className="bg-card shadow-sm dark:shadow-none shadow-shadow-color dark:border rounded-md p-3 h-fit lg:mr-5">
						<h2 className="px-3 font-semibold text-lg mb-3">Who to follow</h2>
						<div className="space-y-5">
							{Array.from({ length: 3 }).map((_, index) => {
								return (
									<div
										key={index}
										className="flex items-center justify-between"
									>
										<div className="flex items-center justify-between space-x-4">
											<Skeleton className="h-12 w-12 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-[60px]" />
												<Skeleton className="h-4 w-[100px]" />
											</div>
										</div>
										<Skeleton className="h-8 w-[60px]" />
									</div>
								);
							})}
						</div>
					</div>
				}
			>
				<WhoToFollow />
			</Suspense>
			<Suspense
				fallback={
					<div className="bg-card shadow-sm dark:shadow-none shadow-shadow-color dark:border rounded-md p-3 h-fit lg:mr-5">
						<h2 className="px-3 font-semibold text-lg mb-2">
							Trending HashTags
						</h2>
						<div className="space-y-5">
							{Array.from({ length: 5 }).map((_, index) => {
								return (
									<div key={index} className="space-y-2">
										<Skeleton className="h-4 w-[100px]" />
										<Skeleton className="h-4 w-[60px]" />
									</div>
								);
							})}
						</div>
					</div>
				}
			>
				<TrendingHashTags />
			</Suspense>
		</aside>
	);
};

export default TrendsSidebar;
