"use client";

import { cn } from "@/utils/utils";
import { Bell, Bookmark, Home, Lock, Store, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import UnauthorizedModal from "../UnauthorizedModal";
import { useState } from "react";

const SocialSidebarLeft = () => {
	const pathname = usePathname();
	// const session = useSession();
	const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
	return (
		<>
			<aside className="bg-card/20 backdrop-blur-3xl shadow-sm dark:shadow-none shadow-shadow-color dark:border z-50 md:z-0 md:rounded-md md:p-2 h-16 md:bg-card md:backdrop-blur-none lg:ml-5 fixed bottom-0 right-0 w-full md:sticky md:top-[5.3rem] md:h-fit flex-[0] lg:flex-[2]">
				<ul className="flex md:flex-col h-full items-center justify-center md:items-start">
					<li
						className={cn(
							"md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg",
							{
								"text-primary font-semibold dark:hover:text-primary":
									pathname == "/",
							}
						)}
					>
						<Link href={"/"} className="flex items-center gap-3 text-md p-3">
							<Home className="size-6" />
							<p className="hidden lg:flex text-lg">Home</p>
						</Link>
					</li>
					<li
						className={cn(
							"md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg",
							{
								"text-primary font-semibold dark:hover:text-primary":
									pathname == "/marketplace",
							}
						)}
					>
						<Link
							href={"/marketplace"}
							className="flex items-center gap-3 text-md p-3"
						>
							<Store className="size-6" />
							<p className="hidden lg:flex text-lg">MarketPlace</p>
						</Link>
					</li>
					{/* {session.data?.user ? (
						<>
							<li
								className={cn(
									"md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg",
									{
										"text-primary font-semibold dark:hover:text-primary":
											pathname == "/notifications",
									}
								)}
							>
								<Link
									href={"/notifications"}
									className="flex items-center gap-3 text-md p-3"
								>
									<Bell className="size-6" />
									<p className="hidden lg:flex text-lg">Notifications</p>
								</Link>
							</li>
							<li className="md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg">
								<Link
									href={"/bookmarks"}
									className="flex items-center gap-3 text-md p-3"
								>
									<Bookmark className="size-6" />
									<p className="hidden lg:flex text-lg">Bookmarks</p>
								</Link>
							</li>
							<li className="md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg">
								<Link
									href={`/users/${session.data?.user.id}`}
									className="flex items-center gap-3 text-md p-3"
								>
									<User className="size-6" />
									<p className="hidden lg:flex text-lg">Profile</p>
								</Link>
							</li>
						</>
					) : (
						<>
							<li
								onClick={() => setShowUnauthorizedModal(true)}
								className={cn(
									"md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg",
									{
										"text-primary font-semibold dark:hover:text-primary":
											pathname == "/notifications",
									}
								)}
							>
								<div className="flex items-center justify-between gap-3 text-md p-3 cursor-pointer">
									<div className="flex gap-3">
										<Bell className="size-6" />
										<p className="hidden lg:flex text-lg">Notifications</p>
									</div>
									<Lock className="size-4 text-gray-500" />
								</div>
							</li>
							<li
								onClick={() => setShowUnauthorizedModal(true)}
								className={cn(
									"md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg",
									{
										"text-primary font-semibold dark:hover:text-primary":
											pathname == "/notifications",
									}
								)}
							>
								<div className="flex items-center justify-between gap-3 text-md p-3 cursor-pointer">
									<div className="flex gap-3">
										<Bookmark className="size-6" />
										<p className="hidden lg:flex text-lg">Bookmarks</p>
									</div>
									<Lock className="size-4 text-gray-500" />
								</div>
							</li>
							<li
								onClick={() => setShowUnauthorizedModal(true)}
								className={cn(
									"md:w-full transition-all duration-150 ease-in-out hover:bg-primary hover:text-white dark:hover:bg-secondary rounded-lg",
									{
										"text-primary font-semibold dark:hover:text-primary":
											pathname == "/notifications",
									}
								)}
							>
								<div className="flex items-center justify-between gap-3 text-md p-3 cursor-pointer">
									<div className="flex gap-3">
										<User className="size-6" />
										<p className="hidden lg:flex text-lg">Profile</p>
									</div>
									<Lock className="size-4 text-gray-500" />
								</div>
							</li>
						</>
					)} */}
				</ul>
			</aside>
			<UnauthorizedModal
				setShowUnauthorizedModal={setShowUnauthorizedModal}
				showUnauthorizedModal={showUnauthorizedModal}
			/>
		</>
	);
};

export default SocialSidebarLeft;
