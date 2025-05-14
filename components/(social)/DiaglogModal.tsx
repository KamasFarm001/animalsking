"use client";

import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import UnauthorizedModal from "../UnauthorizedModal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileModal = () => {
	const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
	const [showEditProfileModal, setShowEditProfileModal] = useState(false);
	const session = useSession();

	return (
		<>
			<Dialog
				open={showEditProfileModal}
				onOpenChange={setShowEditProfileModal}
			>
				<DialogTrigger
					onClick={() => {
						if (!session.data?.user) {
							setShowUnauthorizedModal(true);
						} else {
							setShowEditProfileModal(true);
						}
					}}
					asChild
					className="text-destructive"
				>
					<Button className="text-white" type="button">
						Edit Profile
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Profile</DialogTitle>
						<DialogDescription>
							Changes made here will be updated on you profile
						</DialogDescription>
						<div className=" mb-2 flex-col flex gap-2 items-center">
							<div className="flex gap-4 items-center">
								<Avatar className="size-40">
									<AvatarImage
										// src={user?.avatarUrl}
										// alt={user?.displayName || user?.username}
										className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
									/>
									<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
										{/* {generateAbbr(user?.username!)} */}
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
					</DialogHeader>

					<DialogFooter className="sm:justify-start justify-between w-full gap-2">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Cancel
							</Button>
						</DialogClose>
						<Button type="button" variant="default" className="text-white">
							Update
							{/* {mutation.isPending ? <CircularLoader /> : "Delete"} */}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<UnauthorizedModal
				// setUnauthorizedModalIsLoading={setUnauthorizedModalIsLoading}
				showUnauthorizedModal={showUnauthorizedModal}
				setShowUnauthorizedModal={setShowUnauthorizedModal}
				// UnauthorizedModalIsLoading={UnauthorizedModalIsLoading}
			/>
		</>
	);
};

export default ProfileModal;
