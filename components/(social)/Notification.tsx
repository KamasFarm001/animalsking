import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Ellipsis, Flag, Trash2 } from "lucide-react";
import PostAction from "./PostAction";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Notification = () => {
	return (
		<div className="rounded-sm relative top-10 p-5 flex flex-col gap-3 shadow-sm border bg-card">
			<div className="flex items-center gap-5 justify-between">
				<div className="flex gap-4 items-center  ">
					<Avatar className="size-12">
						<AvatarImage
							src=""
							alt=""
							className="border shadow-sm cursor-pointer"
						/>
						<AvatarFallback className="text-sm border shadow-sm cursor-pointer">
							CN
						</AvatarFallback>
					</Avatar>
				</div>
			</div>
			<p className="whitespace-pre-line break-words text-md">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis hic
				repellat magnam.
			</p>
		</div>
	);
};

export default Notification;
