"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Paperclip, Smile } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { CircularLoader } from "../Loader";
import { AddToSelectionRange, cn, generateAbbr } from "@/utils/utils";
import { useSubmitPostMutation } from "@/hooks/useMutation";
import { useEffect, useRef, useState } from "react";
import PostInput from "./PostInput";
import UnauthorizedModal from "../UnauthorizedModal";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

export interface IEmoji {
	emoticons: string[];
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
}

export type postDataType = z.infer<typeof postSchema>;

const PostAContent = () => {
	// const session = useSession();
	const form = useForm<postDataType>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			postText: "",
		},
	});
	const mutation = useSubmitPostMutation();

	const editorRef = useRef<HTMLDivElement | null>(null);
	const emojiPackRef = useRef<HTMLDivElement | null>(null);
	const toggleEmojiRef = useRef<HTMLButtonElement | null>(null);
	const [showEmojiPack, setShowEmojiPack] = useState(false);
	const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
	const [UnauthorizedModalIsLoading, setUnauthorizedModalIsLoading] =
		useState(false);
	const { theme } = useTheme();

	// const onSubmit = async (data: postDataType) => {
	// 	if (!session || !session.data?.user) {
	// 		setShowUnauthorizedModal(true);
	// 	} else {
	// 		const formData = new FormData();
	// 		if (data.postText) {
	// 			formData.append("postText", data.postText);
	// 			mutation.mutate(formData, {
	// 				onSuccess: () => {
	// 					form.reset();
	// 					if (editorRef.current) {
	// 						editorRef.current.innerHTML = "";
	// 					}
	// 				},
	// 			});
	// 		}
	// 		editorRef.current?.focus();
	// 	}
	// };

	useEffect(() => {
		editorRef.current?.focus();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				emojiPackRef.current &&
				!emojiPackRef.current.contains(event.target as Node) &&
				toggleEmojiRef.current &&
				!toggleEmojiRef.current.contains(event.target as Node) &&
				editorRef.current &&
				!editorRef.current.contains(event.target as Node)
			) {
				setShowEmojiPack(false);
			}
			return;
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleEmojiClick = (emoji: IEmoji) => {
		//Feat: places emoji to the cursor position.
		AddToSelectionRange(editorRef, emoji.native);
		//update state
		form.setValue("postText", editorRef?.current!.innerText.trim(), {
			shouldDirty: true,
		});
	};

	const handleToggleEmoji = () => {
		if (editorRef.current?.textContent?.length == 0) {
			editorRef.current.focus();
			setShowEmojiPack(!showEmojiPack);
		} else {
			AddToSelectionRange(editorRef); //moves cursor to the end of a text if contentEditable already have text inside
			setShowEmojiPack(!showEmojiPack);
		}
	};

	const onSubmit = () => {};

	return (
		<>
			<Form {...form}>
				<form
					// onSubmit={form.handleSubmit(onSubmit)}
					className="dark:border shadow-sm dark:shadow-none shadow-shadow-color bg-card p-5 rounded-md"
				>
					<div className="flex gap-5 flex-col">
						<div className="flex gap-4 items-center">
							<Avatar className="size-14 mb-auto">
								{/* <AvatarImage
									src={session?.data?.user.avatarUrl}
									alt={session?.data?.user?.username}
									className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
								/>
								<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
									{generateAbbr(session?.data?.user?.username || "AK")}
								</AvatarFallback> */}
							</Avatar>

							<PostInput
								editorRef={editorRef}
								form={form}
								onSubmit={onSubmit}
								disabled={mutation.isPending || !form.formState.isDirty}
							/>
						</div>
						<div className="flex relative items-center justify-end mt-auto gap-5">
							<Button
								ref={toggleEmojiRef}
								onClick={handleToggleEmoji}
								type="button"
								variant={"ghost"}
							>
								<Smile className="text-primary cursor-pointer active:scale-110 transition-transform duration-200" />
							</Button>
							<div
								onClick={(e) => {
									e.stopPropagation();
								}}
								ref={emojiPackRef}
								className={cn(
									"absolute shadow-lg top-3/4 right-1/2 md:top-1/2 md:right-2/3 z-40 translate-x-1/2",
									{ hidden: !showEmojiPack }
								)}
							>
								<Picker
									theme={theme == "system" ? "auto" : theme}
									categories={[
										"frequent",
										"people",
										"nature",
										"foods",
										"activity",
										"places",
									]}
									data={data}
									onEmojiSelect={handleEmojiClick}
								/>
							</div>
							<Label htmlFor="upload" className="cursor-pointer">
								<Input id="upload" type="file" className="hidden" />
								<Paperclip
									className={cn(
										"size-5 disabled:text-primary/50 text-primary enabled:hover:text-primary/80 transition-all duration-150"
									)}
								/>
							</Label>

							<Button
								disabled={
									mutation.isPending ||
									!form.formState.isDirty ||
									!form.getValues("postText").length
								}
								type="submit"
								className="bg-primary/60 text-white"
							>
								{mutation.isPending ? <CircularLoader /> : "Create Post"}
							</Button>
						</div>
					</div>
				</form>
			</Form>
			<UnauthorizedModal
				setShowUnauthorizedModal={setShowUnauthorizedModal}
				showUnauthorizedModal={showUnauthorizedModal}
				UnauthorizedModalIsLoading={UnauthorizedModalIsLoading}
				setUnauthorizedModalIsLoading={setUnauthorizedModalIsLoading}
			/>
		</>
	);
};

export default PostAContent;
