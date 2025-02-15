import connectDb from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const cursor = searchParams.get("cursor") || undefined;
	const userId = searchParams.get("userId");
	const pageSize = 2;

	// Build query with cursor if it exists
	const query = cursor ? { _id: { $lt: new Types.ObjectId(cursor) } } : {};

	try {
		if (!userId || !Types.ObjectId.isValid(userId)) {
			await connectDb();
			const posts = await Post.find(query)
				.populate(
					"author",
					"username email displayName avatarUrl accountTYpe followers following bio"
				)
				.sort({ _id: -1 }) //sort by newest
				.limit(pageSize + 1) //Get one extra to determine if there's a next page
				.lean(); //Convert to plain JavaScript objects for better performance

			const hasNextPage = posts.length > pageSize;

			// Remove the extra item we used to determine if there's a next page
			const paginatedPosts = posts.slice(0, pageSize);
			// Get the next cursor from the last item in our paginated results
			const nextCursor = hasNextPage
				? (posts[pageSize - 1]._id as string)
				: null;

			return NextResponse.json(
				{
					posts: paginatedPosts,
					nextCursor,
					hasNextPage,
				},
				{ status: 200 }
			);
		} else {
			await connectDb();
			const posts = await Post.find({ author: userId })
				.populate(
					"author",
					"username email displayName avatarUrl accountTYpe followers following bio"
				)
				.sort({ _id: -1 }) //sort by newest
				.limit(pageSize + 1) //Get one extra to determine if there's a next page
				.lean(); //Convert to plain JavaScript objects for better performance

			const hasNextPage = posts.length > pageSize;

			// Remove the extra item we used to determine if there's a next page
			const paginatedPosts = posts.slice(0, pageSize);
			// Get the next cursor from the last item in our paginated results
			const nextCursor = hasNextPage
				? (posts[pageSize - 1]._id as string)
				: null;

			return NextResponse.json(
				{
					posts: paginatedPosts,
					nextCursor,
					hasNextPage,
				},
				{ status: 200 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ message: "An error ocurred fetching posts " + error },
			{ status: 500 }
		);
	}
};

export const POST = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const body = await request.json();
	const { content } = body;

	const requiredFields = { content };
	const missingFields = Object.entries(requiredFields)
		.filter(([_, value]) => !value)
		.map(([key]) => key);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{ message: `Missing required fields: ${missingFields.join(", ")}` },
			{ status: 400 }
		);
	}

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}
	const userCreatingPost = await User.findById(userId);
	if (!userCreatingPost) {
		return NextResponse.json(
			{ message: "Cannot find user creating post" },
			{ status: 404 }
		);
	}

	try {
		await connectDb();
		const newPost = new Post({
			content,
			author: userId,
		});

		await newPost.save();
		const populatedPost = await Post.findById(newPost._id).populate(
			"author",
			"username email displayName avatarUrl"
		);

		return NextResponse.json(
			{
				message: "You have a new post",
				newPost: populatedPost,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error creating post " + error },
			{ status: 500 }
		);
	}
};
