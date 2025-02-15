import connectDb from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import { Types } from "mongoose";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");

	const userIdToExclude = searchParams.get("userIdToExclude");
	const filter = {
		_id: { $ne: userIdToExclude },
	};

	// const projections = {
	// 	name: 1,
	// 	email: 1,
	// };
	const projections = JSON.parse(searchParams.get("projections") as string);
	const limit = JSON.parse(searchParams.get("limit") as string);

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json({ message: "invalid userId" }, { status: 400 });
	}
	try {
		await connectDb();
		const userExisting = await User.findById(userId);
		if (!userExisting) {
			return NextResponse.json({ message: "userId do not exist" });
		}
		const users = await User.find(filter).select(projections).limit(limit);
		return NextResponse.json({ users }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Error fetching users" },
			{ status: 500 }
		);
	}
};

export const POST = async (request: Request) => {
	try {
		await connectDb();
		const body = await request.json();
		const { email, username, phone, country } = body;
		if (!email || !username || !phone || !country) {
			return NextResponse.json({
				message: "email, phone, country or username was not provided",
			});
		}

		const newUser = new User({
			email,
			username,
			phone,
			country,
			accountType: "personal",
			hasVerifiedAccount: false,
			verificationCodeSentAt: new Date().getTime(),
			onetimeVerificationCode: generateVerificationCode(),
		});

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			await newUser.save();

			console.log(`verification code: ${newUser.onetimeVerificationCode}`);
			//!send verification through email

			return NextResponse.json(
				{ message: "A verification code has been sent", userId: newUser._id },
				{ status: 200 }
			);
		}
		if (existingUser) {
			return NextResponse.json(
				{
					message: "A user with that account already exist",
				},
				{ status: 400 }
			);
		}
	} catch (error: any) {
		console.log(error);
		if (error.code === 11000) {
			return NextResponse.json(
				{ message: "A user with that account already exist" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "error creating user" },
			{ status: 500 }
		);
	}
};
