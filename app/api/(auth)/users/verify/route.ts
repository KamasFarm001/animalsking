import connectDb from "@/lib/db";
import RateLimit from "@/models/rateLimit";
import User from "@/models/user";
import { isVerificationCodeExpired } from "@/utils/generateVerificationCode";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const body = await request.json();
	const { otp } = body;

	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "userId was not provided or is invalid" },
			{ status: 400 }
		);
	}

	if (!otp) {
		return NextResponse.json(
			{ message: "otp code was not provided" },
			{ status: 400 }
		);
	}
	try {
		await connectDb();
		const user = await User.findOne({ _id: userId });
		if (!user) {
			return NextResponse.json(
				{ message: "No user was found with the id" },
				{ status: 404 }
			);
		}

		const verificationExpired = await isVerificationCodeExpired({
			model: "user",
			userId,
		});

		if (verificationExpired) {
			user.onetimeVerificationCode = "";
			user.verificationCodeSentAt = "";

			await user.save();
			await RateLimit.findOneAndDelete({ userId });

			return NextResponse.json(
				{ message: "Verification code expired" },
				{ status: 400 }
			);
		}

		if (user.onetimeVerificationCode !== otp) {
			return NextResponse.json(
				{ message: "Invalid verification code" },
				{ status: 400 }
			);
		}
		user.onetimeVerificationCode = "";
		user.verificationCodeSentAt = "";

		await RateLimit.findOneAndDelete({ userId });
		await user.save();

		const {
			_id,
			email,
			username,
			accountType,
			hasVerifiedAccount,
			country,
			phone,
			businesses,
			createdAt,
			updatedAt,
		} = user;

		return NextResponse.json(
			{
				message: "You are authenticated!",
				user: {
					_id,
					email,
					username,
					accountType,
					hasVerifiedAccount,
					country,
					phone,
					businesses,
					createdAt,
					updatedAt,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error verifying otp " + error },
			{ status: 500 }
		);
	}
};
