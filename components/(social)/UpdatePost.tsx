"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PostInput from "./PostInput";
import { generateAbbr } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { postSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { postDataType } from "./PostAContent";
import { SessionContextValue } from "next-auth/react";
import { IPost } from "@/interface/social";
import { Button } from "../ui/button";
import { CircularLoader } from "../Loader";

interface updatePostProps {
	session: SessionContextValue;
	post: IPost;
	setShowUnauthorizedModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePost = ({
	session,
	post,
	setShowUnauthorizedModal,
}: updatePostProps) => {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const [showUpdatePostModal, setShowUpdatePostModal] = useState(false);
	const [content, setContent] = useState(post?.content || "");
	const form = useForm<postDataType>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			postText: "",
		},
	});

	const onSubmit = async (data: postDataType): Promise<void> => {
		if (!session || !session.data?.user) {
			setShowUnauthorizedModal(true);
		} else {
			const formData = new FormData();
			console.log(data);
			// if (data.postText) {
			// 	formData.append("postText", data.postText);
			// 	mutation.mutate(formData, {
			// 		onSuccess: () => {
			// 			form.resetField("postText");
			// 			if (editorRef.current) {
			// 				editorRef.current.innerHTML = "";
			// 			}
			// 		},
			// 	});
			// }
			editorRef.current?.focus();
		}
	};

	useEffect(() => {
		if (showUpdatePostModal && editorRef.current) {
			// Set initial content and focus when modal opens
			editorRef.current.innerHTML = post?.content || "";
			editorRef.current.focus();
		}
	}, [showUpdatePostModal, post?.content]);

	return (
		<Dialog
			onOpenChange={(open) => {
				setShowUpdatePostModal(open);
				if (open) {
					console.log(editorRef.current);
				}
			}}
			open={showUpdatePostModal}
		>
			<DialogTrigger asChild>
				<span className="w-full">Edit</span>
			</DialogTrigger>
			<DialogContent className="max-w-xl bg-card">
				<DialogHeader>
					<DialogTitle>Edit Post</DialogTitle>

					<DialogDescription>
						Your existing post will be updated with this when you save.
					</DialogDescription>
					<div className="flex pt-3 items-center gap-2">
						<Avatar className="size-14 mb-auto">
							<AvatarImage
								src={session?.data?.user.avatarUrl}
								alt={session?.data?.user?.username}
								className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
							/>
							<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
								{generateAbbr(session?.data?.user?.username || "AK")}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold">{post?.author?.username}</p>
							{post?.author?.displayName && (
								<span className="text-muted-foreground">
									@{post?.author?.displayName}
								</span>
							)}
						</div>
					</div>
				</DialogHeader>

				<DialogFooter className="sm:justify-start gap-2">
					<PostInput
						defaultContent={post.content}
						editorRef={editorRef}
						form={form}
						onSubmit={onSubmit}
					/>
				</DialogFooter>
				<Button
					disabled={form.formState.isSubmitting || !form.formState.isDirty}
					type="submit"
					className="bg-primary/60 w-fit ml-auto text-white"
				>
					{form.formState.isSubmitting ? <CircularLoader /> : "Update Post"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default UpdatePost;
