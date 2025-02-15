"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export const GlobalContextProvider = createContext<{
	isLogoutModal: boolean;
	setIsLogoutModal: Dispatch<SetStateAction<boolean>>;
}>({
	isLogoutModal: false,
	setIsLogoutModal: () => {},
});

const GlobalContext = ({ children }: { children: React.ReactNode }) => {
	const [isLogoutModal, setIsLogoutModal] = useState(false);

	const queryClient = useQueryClient();

	const handleLogOutModal = async () => {
		queryClient.clear();
		await signOut({ callbackUrl: "/signin" });
	};

	return (
		<GlobalContextProvider.Provider value={{ isLogoutModal, setIsLogoutModal }}>
			{children}
			<Dialog onOpenChange={setIsLogoutModal} open={isLogoutModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Log Out</DialogTitle>
						<DialogDescription>
							You will be logged out and will need to log in again to continue.
							Are you sure you want to log out?
						</DialogDescription>
					</DialogHeader>

					<DialogFooter className="sm:justify-start gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsLogoutModal(false)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="default"
							className="text-white"
							onClick={handleLogOutModal}
						>
							Logout
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</GlobalContextProvider.Provider>
	);
};

export default GlobalContext;
