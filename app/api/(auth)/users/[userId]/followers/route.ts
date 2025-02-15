import connectDb from "@/lib/db";
import Follower from "@/models/follower";
import Post from "@/models/post";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// Get user's followers
export const GET = async (
	req: Request,
	context: { params: { userId: string } }
) => {
	const { searchParams } = new URL(req.url);

	const getFollowedByAndCount = searchParams.get("getFollowedByAndCount");
	const followId = searchParams.get("followId");

	const userId = context.params.userId;

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid user ID or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		const { followers } = await User.findById(userId, "followers");
		const { following } = await User.findById(userId, "following");

		if (getFollowedByAndCount && followId) {
			const newUpdatedFollow = await User.findById(followId);

			const isFollowedByUser = newUpdatedFollow.followers.includes(userId);
			const isFollowingUser = newUpdatedFollow.following.includes(userId);
			const userPost = await Post.find({ author: followId });

			return NextResponse.json(
				{
					message: "Followed successfully",
					followersCount: followers.length,
					followingCount: following.length,
					postCount: userPost.length,
					followers,
					following,
					isFollowedByUser,
					isFollowingUser,
				},
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{
					_id: userId,
					followers,
					following,
				},
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error("Error fetching followers/following:", error);
		return NextResponse.json(
			{ message: "Error fetching followers/following" },
			{ status: 500 }
		);
	}
};

// Follow a user
export const POST = async (
	req: Request,
	context: { params: { userId: string } }
) => {
	const { searchParams } = new URL(req.url);
	const followUserId = searchParams.get("followUserId");
	const userId = context.params.userId;

	// Validate input parameters
	if (!followUserId || !Types.ObjectId.isValid(followUserId)) {
		return NextResponse.json(
			{ message: "Invalid follower user ID or not provided" },
			{ status: 400 }
		);
	}
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid target user ID or not provided" },
			{ status: 400 }
		);
	}

	// Prevent self-following
	if (followUserId === userId) {
		return NextResponse.json(
			{ message: "Users cannot follow themselves" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		// Find both users
		const [targetUser, followUser] = await Promise.all([
			User.findById(userId),
			User.findById(followUserId),
		]);

		if (!followUser) {
			return NextResponse.json(
				{ message: "Follower user not found" },
				{ status: 404 }
			);
		}
		if (!targetUser) {
			return NextResponse.json(
				{ message: "Target user not found" },
				{ status: 404 }
			);
		}

		// Check if already following
		const existingFollow = await User.findOne({
			followerId: followUserId,
			followingId: userId,
		});

		if (existingFollow) {
			return NextResponse.json(
				{ message: "Already following this user" },
				{ status: 400 }
			);
		}
		// Create new follower relationship
		const newFollower = new Follower({
			followerId: userId,
			followingId: followUserId,
		});

		await newFollower.save();

		await Promise.all([
			User.findByIdAndUpdate(
				followUserId,
				{
					$push: { followers: userId },
				},
				{ new: true }
			),

			User.findByIdAndUpdate(
				userId,
				{
					$push: { following: followUserId },
				},
				{ new: true }
			),
		]);

		const newUpdatedFollow = await User.findById(followUser._id);

		const isFollowedByUser = newUpdatedFollow.followers.includes(userId);

		return NextResponse.json(
			{
				message: "Followed successfully",

				isFollowedByUser,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		if (error.code === 11000) {
			return NextResponse.json(
				{ message: "Already following this user" },
				{ status: 400 }
			);
		}
		console.error("Error following user:", error);
		return NextResponse.json(
			{ message: "Error following user" },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	req: Request,
	context: { params: { userId: string } }
) => {
	const { searchParams } = new URL(req.url);
	const unfollowUserId = searchParams.get("unfollowUserId");

	const userId = context.params.userId;

	if (!unfollowUserId || !Types.ObjectId.isValid(unfollowUserId)) {
		return NextResponse.json(
			{ message: "Invalid follower user ID" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();

		const result = await Follower.findOneAndDelete({
			followerId: userId,
			followingId: unfollowUserId,
		});

		if (!result) {
			return NextResponse.json(
				{ message: "Follow relationship not found" },
				{ status: 404 }
			);
		}

		await Promise.all([
			User.findByIdAndUpdate(
				unfollowUserId,
				{
					$pull: { followers: userId },
				},
				{ new: true }
			),

			User.findByIdAndUpdate(
				userId,
				{
					$pull: { following: unfollowUserId },
				},
				{ new: true }
			),
		]);

		const newUpdatedUnFollow = await User.findById(unfollowUserId);

		const isFollowedByUser = newUpdatedUnFollow.followers.includes(userId);

		return NextResponse.json(
			{
				followersCount: newUpdatedUnFollow.followersCount,
				isFollowedByUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error unFollowing user:", error);
		return NextResponse.json(
			{ message: "Error unFollowing user" },
			{ status: 500 }
		);
	}
};
