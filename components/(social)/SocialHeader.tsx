"use client";
import {
	Check,
	ChevronDown,
	ChevronRight,
	LogIn,
	LogOut,
	Moon,
	Search,
	Settings,
	SunMoon,
	TvMinimal,
	User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { generateAbbr } from "@/utils/utils";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { GlobalContextProvider } from "@/contexts/GlobalContext";

const SocialHeader = () => {
	const session = useSession();
	const { setTheme, theme } = useTheme();
	const router = useRouter();
	const { setIsLogoutModal } = useContext(GlobalContextProvider);

	useEffect(() => {
		const handleKeyPress = async (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === "l") {
				e.preventDefault();
				setTheme("light");
			}
			if (e.ctrlKey && e.altKey && e.key === "d") {
				e.preventDefault();
				setTheme("dark");
			}
			if (e.ctrlKey && e.key === "y") {
				e.preventDefault();
				setTheme("system");
			}
			if (e.ctrlKey && e.key === "q") {
				e.preventDefault();
				setIsLogoutModal(true);
			}

			if (e.ctrlKey && e.key === "s") {
				e.preventDefault();
				router.push("/settings"); //open settings
			}
		};
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [router, setIsLogoutModal, setTheme]);

	return (
		<>
			<header className="dark:border-b shadow-sm dark:shadow-none shadow-shadow-color z-50 text-foreground sticky top-0 bg-card dark:bg-card/20 dark:backdrop-blur-xl dark:saturate-150">
				<div className=" flex items-center justify-between gap-3 my-max py-3 px-5">
					<div className="flex gap-3 items-center">
						<h1>Logo</h1>
					</div>
					<div className="relative w-full mx-auto max-w-xl">
						<Search className="top-1/2 -translate-y-1/2 left-3 text-gray-400 pointer-events-none size-5 dark:text-card-foreground absolute" />
						<Input
							className="max-w-full h-12 w-full pl-9 dark:placeholder:text-white text-base dark:border-border border-gray-300 bg-background dark:bg-card rounded-full"
							placeholder="Search..."
						/>
					</div>
					<ul className="flex items-center gap-4">
						{session.data?.user && (
							<li>
								<Link href={"/dashboard"}>Dashboard</Link>
							</li>
						)}
						<li>
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild className="cursor-pointer">
									<div className="flex gap-2 items-center">
										<div className="flex gap-4 items-center  ">
											<Avatar className="size-12">
												<AvatarImage
													src=""
													alt=""
													className="border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer"
												/>
												<AvatarFallback className="text-sm border shadow-sm dark:shadow-none shadow-shadow-color cursor-pointer">
													{generateAbbr(session?.data?.user.username || "AK")}
												</AvatarFallback>
											</Avatar>
										</div>
										<div className="hidden md:flex flex-col">
											<h3 className="line-clamp-1 break-all scroll-m-20 text-md font-semibold tracking-tight first:mt-0">
												{session?.data?.user?.username}
											</h3>
											<small className="text-sm text-left line-clamp-1 break-all font-normal text-muted-foreground leading-none">
												@{session?.data?.user.displayName || "iamFarmer"}
											</small>
										</div>
										<ChevronDown className="size-5" />
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 relative right-5">
									<DropdownMenuGroup>
										{session.data?.user && (
											<Link href={`/users/${session.data?.user.id}`}>
												<DropdownMenuItem className="cursor-pointer">
													<User className="mr-2 h-4 w-4" />
													<span>Profile</span>
												</DropdownMenuItem>
											</Link>
										)}

										<Link href={`/settings`}>
											<DropdownMenuItem className="cursor-pointer">
												<Settings className="mr-2 h-4 w-4" />
												<span>Settings</span>
												<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
											</DropdownMenuItem>
										</Link>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuSub>
											<DropdownMenuSubTrigger className="cursor-pointer flex items-center justify-between">
												<span className="flex items-center">
													<TvMinimal className="mr-2 h-4 w-4" />
													Theme
												</span>
												<ChevronRight className="h-4 w-4" />
												<DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
											</DropdownMenuSubTrigger>
											<DropdownMenuPortal>
												<DropdownMenuSubContent>
													<DropdownMenuItem onClick={() => setTheme("system")}>
														<span className="flex gap-1 items-center">
															<TvMinimal className="mr-2 h-4 w-4" />
															System
															{theme === "system" && (
																<Check className="size-4" />
															)}
														</span>
														<DropdownMenuShortcut>⌘+Y</DropdownMenuShortcut>
													</DropdownMenuItem>
													<DropdownMenuItem onClick={() => setTheme("light")}>
														<span className="flex gap-1 items-center">
															<SunMoon className="mr-2 h-4 w-4" />
															Light
															{theme === "light" && (
																<Check className="size-4" />
															)}
														</span>
														<DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
													</DropdownMenuItem>
													<DropdownMenuItem onClick={() => setTheme("dark")}>
														<span className="flex items-center gap-1">
															<Moon className="mr-2 h-4 w-4" />
															Dark
															{theme === "dark" && <Check className="size-4" />}
														</span>
														<DropdownMenuShortcut>⌘+D</DropdownMenuShortcut>
													</DropdownMenuItem>
												</DropdownMenuSubContent>
											</DropdownMenuPortal>
										</DropdownMenuSub>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />

									{session.data?.user ? (
										<DropdownMenuItem
											className="cursor-pointer"
											onClick={() => setIsLogoutModal(true)}
										>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Log out</span>
											<DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem
											className="cursor-pointer"
											onClick={() => router.push("/signin")}
										>
											<LogIn className="mr-2 h-4 w-4" />
											<span>Log in</span>
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					</ul>
				</div>
			</header>
		</>
	);
};

export default SocialHeader;
