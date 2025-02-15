import connectDb from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}

	const cursor = searchParams.get("cursor") || undefined;
	const pageSize = 2;

	// Build query with cursor if it exists
	try {
		await connectDb();
		const findFollowingUsers = await User.find({ _id: userId }, "following");

		const getIdsFollowingMe: string[] = findFollowingUsers
			.flatMap((users) => users.following)
			.filter((ids) => ids !== userId);

		const query = cursor
			? {
					_id: { $lt: new Types.ObjectId(cursor) },
					author: { $in: getIdsFollowingMe },
			  }
			: { author: { $in: getIdsFollowingMe } };

		const findPostOfFollowingMeUsers = await Post.find(query)
			.populate("author", "username email displayName avatarUrl")
			.sort({ _id: -1 })
			.limit(pageSize + 1)
			.lean();

		const hasNextPage = findPostOfFollowingMeUsers.length > pageSize;

		// Remove the extra item we used to determine if there's a next page
		const paginatedPosts = findPostOfFollowingMeUsers.slice(0, pageSize);
		// Get the next cursor from the last item in our paginated results
		const nextCursor = hasNextPage
			? (findPostOfFollowingMeUsers[pageSize - 1]._id as string)
			: null;

		return NextResponse.json(
			{
				posts: paginatedPosts,
				nextCursor,
				hasNextPage,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error fetching following posts" },
			{ status: 500 }
		);
	}
};
