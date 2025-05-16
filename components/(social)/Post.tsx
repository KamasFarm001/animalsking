"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import PostAction from "./PostAction";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	cn,
	formatRelativeDate,
	generateAbbr,
	hashtagsRegex,
} from "@/utils/utils";
import { IPost } from "@/interface/social";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useDeletePostMutation } from "@/hooks/useMutation";
import { CircularLoader } from "../Loader";
import UnauthorizedModal from "../UnauthorizedModal";
import UpdatePost from "./UpdatePost";
import Link from "next/link";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";

const Post = (post: IPost) => {
	const parts = post?.content
		?.split(hashtagsRegex)
		?.filter((text) => !text.match(hashtagsRegex));

	const hashtags = post?.content
		?.split(hashtagsRegex)
		?.filter((text) => text.match(hashtagsRegex));

	const mutation = useDeletePostMutation();
	const [closeDialog, setCloseDialog] = useState(false);
	const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
	const [UnauthorizedModalIsLoading, setUnauthorizedModalIsLoading] =
		useState(false);

	return (
		<>
			<article className="group/post rounded-sm p-5 flex flex-col gap-2 shadow-sm dark:shadow-none shadow-shadow-color dark:border bg-card">
				<div className="flex items-center gap-5 justify-between">
					<div className=" mb-2 flex gap-2 items-center">
						<UserTooltip user={post.author} sessionId={""}>
							<div className="flex gap-4 items-center  ">
								<Avatar className="size-12">
									<AvatarImage
										src={post?.author?.avatarUrl}
										alt={post?.author?.displayName || post?.author?.username}
										className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
									/>
									<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
										{generateAbbr(post?.author?.username)}
									</AvatarFallback>
								</Avatar>
							</div>
						</UserTooltip>
						<div>
							<div className="flex items-center gap-2">
								<Link
									href={`/users/${post.author?._id}`}
									className="flex hover:underline items-center gap-2 scroll-m-20 text-md font-medium tracking-tight"
								>
									<UserTooltip user={post.author} sessionId={""}>
										<h2>{post.author?.username}</h2>
									</UserTooltip>

									{post.updated && (
										<small className="text-sm font-normal text-muted-foreground leading-none">
											{"updated"}
										</small>
									)}
								</Link>
								<small className="text-sm font-normal text-muted-foreground leading-none">
									{formatRelativeDate(new Date(post?.createdAt))}
								</small>
							</div>
							<Link
								href={`/users/${post.author?._id}`}
								className="text-sm block w-full line-clamp-1 break-all font-normal text-muted-foreground leading-none"
							>
								@{post.author?.displayName || "iamFarmer"}
							</Link>
						</div>
					</div>

					<DropdownMenu modal={closeDialog}>
						<DropdownMenuTrigger
							asChild
							className={cn(
								"relative -top-5 group-hover/post:opacity-100 opacity-0 transition-opacity",
								{
									// hidden: post?.author?._id !== session?.data?.user.id,
								}
							)}
						>
							<Ellipsis className="size-5 cursor-pointer text-muted-foreground hover:text-foreground" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 relative right-5">
							<DropdownMenuGroup>
								<DropdownMenuItem
									className="cursor-pointer"
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									<Edit className="mr-2 size-5" />

									<UpdatePost
										setShowUnauthorizedModal={setShowUnauthorizedModal}
										session={"session"}
										post={post}
									/>
								</DropdownMenuItem>
								{/* <DropdownMenuItem className="cursor-pointer">
									<Flag className="mr-2 size-5" />
									<span>Report</span>
								</DropdownMenuItem> */}
								<DropdownMenuItem
									className="cursor-pointer"
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									<Trash2 className="mr-2 size-5 text-destructive" />

									<Dialog modal>
										<DialogTrigger
											// onClick={() => {
											// 	if (!session.data?.user) {
											// 		setShowUnauthorizedModal(true);
											// 	} else {
											// 		return;
											// 	}
											// }}
											asChild
											className="text-destructive"
										>
											<span className="w-full">Delete</span>
										</DialogTrigger>
										<DialogContent className="sm:max-w-md">
											<DialogHeader>
												<DialogTitle>Delete Post</DialogTitle>
												<DialogDescription>
													Are you sure you want to delete this? This action
													cannot be undone and will be removed from any account
													timeline, profile, and search results.
												</DialogDescription>
											</DialogHeader>

											<DialogFooter className="sm:justify-start gap-2">
												<DialogClose asChild>
													<Button
														type="button"
														onClick={() => {
															setCloseDialog(true);
														}}
														variant="secondary"
													>
														Cancel
													</Button>
												</DialogClose>
												<Button
													type="button"
													variant="destructive"
													disabled={mutation.isPending}
													onClick={() =>
														mutation.mutate(post._id, {
															onSuccess: () => {
																setCloseDialog(true);
															},
														})
													}
												>
													{mutation.isPending ? <CircularLoader /> : "Delete"}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="pl-14">
					<p className="whitespace-pre-line mb-3 break-words text-md">
						{parts?.map((part, index) => (
							<Linkify userId={post?.author?._id} key={index}>
								{part}{" "}
								<span className="text-emerald-600 font-medium hover:underline">
									{hashtags[index]}
								</span>
							</Linkify>
						))}
					</p>

					<PostAction
						setShowUnauthorizedModal={setShowUnauthorizedModal}
						session={"session"}
						postId={post._id}
						likes={post.likes}
						comments={post.comments}
					/>
				</div>
			</article>
			<UnauthorizedModal
				setUnauthorizedModalIsLoading={setUnauthorizedModalIsLoading}
				showUnauthorizedModal={showUnauthorizedModal}
				setShowUnauthorizedModal={setShowUnauthorizedModal}
				UnauthorizedModalIsLoading={UnauthorizedModalIsLoading}
			/>
		</>
	);
};

export default Post;
