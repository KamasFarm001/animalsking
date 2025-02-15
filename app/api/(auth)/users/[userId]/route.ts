import connectDb from "@/lib/db";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (
	request: Request,
	context: { params: { userId: string } }
) => {
	try {
		await connectDb();
		const userId = context.params.userId;
		const { searchParams } = new URL(request.url);
		if (!userId || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json(
				{ message: "Invalid userId or was not provided" },
				{ status: 400 }
			);
		}
		const projections = JSON.parse(searchParams.get("projections") as string);

		const user = await User.findById(userId).select(projections);
		if (!user) {
			return NextResponse.json(
				{ message: "No user was found" },
				{ status: 200 }
			);
		}
		return NextResponse.json({ user }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error fetching users" + error },
			{ status: 500 }
		);
	}
};
export const PATCH = async (
	request: Request,
	context: { params: { userId: string } }
) => {
	const userId = context.params.userId;
	const { username, email, accountType } = await request.json();

	const updateData: {
		username?: string;
		email?: string;
		accountType?: "personal";
	} = {};

	if (username) {
		updateData.username = username;
	}
	if (email) {
		updateData.email = email;
	}
	if (accountType) {
		updateData.accountType = accountType;
	}

	try {
		await connectDb();

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json(
				{
					message: "UserId is invalid or was not provided",
				},
				{ status: 400 }
			);
		}

		const business = await User.findOne({ _id: userId });

		if (!business) {
			return NextResponse.json(
				{ message: "No user was found with the userId provided" },
				{ status: 400 }
			);
		}

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: userId },
			{ $set: updateData },
			{ new: true }
		);
		return NextResponse.json(
			{
				message: "User credentials updated successfully",
				data: updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error updating user " + error },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	request: Request,
	context: { params: { userId: string } }
) => {
	const userId = context.params.userId;

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "userId is invalid or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		const deletedUser = await User.findByIdAndDelete(userId);
		if (!deletedUser) {
			return NextResponse.json({
				message: "No user with the id provided was found",
			});
		}
		return NextResponse.json(
			{ message: "User was successfully deleted" },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "Failed to delete user " + error },
			{ status: 500 }
		);
	}
};
