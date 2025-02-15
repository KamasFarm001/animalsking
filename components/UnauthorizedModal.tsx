"use client";

import { CircularLoader } from "./Loader";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const UnauthorizedModal = ({
	showUnauthorizedModal,
	setShowUnauthorizedModal,
	UnauthorizedModalIsLoading,
	setUnauthorizedModalIsLoading,
}: {
	showUnauthorizedModal: boolean;
	setShowUnauthorizedModal?: Dispatch<SetStateAction<boolean>>;
	UnauthorizedModalIsLoading?: boolean;
	setUnauthorizedModalIsLoading?: Dispatch<SetStateAction<boolean>>;
}) => {
	const handleAuthorizeWithGoogle = () => {
		// setUnauthorizedModalIsLoading(true);
	};
	return (
		<Dialog
			open={showUnauthorizedModal}
			onOpenChange={setShowUnauthorizedModal}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Please sign in</DialogTitle>
					<DialogDescription>
						You are not authorized to perform this action.{" "}
						<Link className="text-primary hover:underline" href={"/signin"}>
							SignIn
						</Link>{" "}
						or{" "}
						<Link className="text-primary hover:underline" href={"/signup"}>
							SignUp
						</Link>
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="sm:justify-start gap-2">
					<Button
						type="button"
						aria-disabled={UnauthorizedModalIsLoading}
						onClick={handleAuthorizeWithGoogle}
						variant="default"
					>
						{UnauthorizedModalIsLoading ? (
							<CircularLoader />
						) : (
							<>
								<FcGoogle className="size-6" />
								<span className="ml-2 font-medium text-white text-md">
									Continue With Google
								</span>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UnauthorizedModal;
