import connectDb from "@/lib/db";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (
	request: Request,
	context: { params: { postId: string } }
) => {
	const postId = context.params.postId;
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}
	if (!postId || !Types.ObjectId.isValid(postId)) {
		return NextResponse.json(
			{ message: "Invalid postId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		const post = await Post.findOne({ _id: postId });
		if (!post) {
			return NextResponse.json({ message: "Post was not found." });
		}

		return NextResponse.json({ post }, { status: 200 });
	} catch (error) {
		return NextResponse.json({
			message: "An error occurred fetching post " + error,
			status: 500,
		});
	}
};

export const PATCH = async (
	request: Request,
	context: { params: { postId: string } }
) => {
	const { searchParams } = new URL(request.url);
	const postId = context.params.postId;
	const userId = searchParams.get("userId");
	const body = await request.json();
	const { content } = body;

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}
	if (!postId || !Types.ObjectId.isValid(postId)) {
		return NextResponse.json(
			{ message: "Invalid postId or was not provided" },
			{ status: 400 }
		);
	}
	if (!content) {
		return NextResponse.json(
			{ message: "update fields were not provided" },
			{ status: 400 }
		);
	}
	try {
		await connectDb();
		const userUpdatingPost = await User.findById(userId);
		if (!userUpdatingPost) {
			return NextResponse.json(
				{ message: "Could not find user updating post" },
				{ status: 404 }
			);
		}
		const findUsersPost = await Post.findOne({ author: userId, _id: postId });
		if (!findUsersPost) {
			return NextResponse.json(
				{ message: "Could not find post belonging to user" },
				{ status: 404 }
			);
		}

		const findAndUpdatePost = await Post.findOneAndUpdate(
			{
				author: userId,
				_id: postId,
			},
			{ content },
			{ new: true }
		);

		if (!findAndUpdatePost) {
			return NextResponse.json(
				{ message: "could not update post" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "post has been updated" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error updating post " + error },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	request: Request,
	context: { params: { postId: string } }
) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const postId = context.params.postId;

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}
	if (!postId || !Types.ObjectId.isValid(postId)) {
		return NextResponse.json(
			{ message: "Invalid postId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		const deletedUserPost = await Post.findOneAndDelete({
			_id: postId,
			author: userId,
		});

		if (!deletedUserPost) {
			return NextResponse.json(
				{ message: "Post not found or You are unauthorized" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ message: "Post was successfully deleted", deletedUserPost },

			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error deleting post " + error },
			{ status: 500 }
		);
	}
};
