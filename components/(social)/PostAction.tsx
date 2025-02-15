"use client";
import { useState } from "react";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/utils/utils";
import { IComments } from "@/interface/social";
import { SessionContextValue } from "next-auth/react";

const PostAction = ({
	likes,
	comments,
	postId,
	session,
	setShowUnauthorizedModal,
}: {
	likes: number;
	comments: IComments[];
	postId: string;
	session: SessionContextValue;
	setShowUnauthorizedModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [like, setLike] = useState(false);
	const [bookMark, setBookMark] = useState(false);

	const handleLikePost = async () => {
		try {
			if (!session || !session.data?.user) {
				setShowUnauthorizedModal(true);
			} else {
				setLike((prev) => !prev);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleBookMarkPost = async () => {
		try {
			if (!session || !session.data?.user) {
				setShowUnauthorizedModal(true);
			} else {
				setBookMark((prev) => !prev);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex items-center justify-between gap-5">
			<div className="flex items-center gap-5">
				<Button
					onClick={handleLikePost}
					className="flex gap-1 p-0 bg-transparent hover:bg-transparent text-foreground"
				>
					<Heart
						className={cn(
							"active:scale-125 transition-all size-6 duration-150",
							{
								"fill-red-600 text-red-600": like,
							}
						)}
					/>
					{likes >= 1 && likes} {likes > 1 ? "likes" : ""}
				</Button>
				<Button className="flex gap-1 p-0 bg-transparent hover:bg-transparent text-foreground">
					<MessageCircle className="siz-6" />
					{comments?.length} {comments?.length > 1 ? "comments" : "comment"}
				</Button>
			</div>

			<Button
				onClick={handleBookMarkPost}
				className="flex gap-1 p-0 bg-transparent hover:bg-transparent text-foreground"
			>
				<Bookmark
					className={cn("active:scale-125 size-6 transition-all duration-150", {
						"fill-primary text-primary": bookMark,
					})}
				/>
			</Button>
		</div>
	);
};

export default PostAction;
