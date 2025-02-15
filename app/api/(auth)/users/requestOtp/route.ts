import connectDb from "@/lib/db";
import RateLimit from "@/models/rateLimit";
import User from "@/models/user";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const COOLDOWN_PERIOD = 2 * 60 * 1000; // 2 minutes in milliseconds
const MAX_REQUESTS = 2; // Maximum number of requests before cooldown

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		// Check rate limit
		const rateLimit = await RateLimit.findOne({ userId });
		const user = await User.findOne({ _id: userId });

		const now = new Date();

		if (!rateLimit) {
			await RateLimit.create({ userId, lastRequestTime: now });
		}

		if (rateLimit) {
			const timeSinceLastRequest =
				now.getTime() - rateLimit.lastRequestTime.getTime();

			if (
				timeSinceLastRequest < COOLDOWN_PERIOD &&
				rateLimit.requestCount >= MAX_REQUESTS
			) {
				const remainingTime = Math.ceil(
					(COOLDOWN_PERIOD - timeSinceLastRequest) / 1000
				);
				return NextResponse.json(
					{
						message: `Rate limit exceeded. Please try again after ${remainingTime} seconds.`,
						remainingTime,
					},
					{ status: 429 }
				);
			}

			if (timeSinceLastRequest >= COOLDOWN_PERIOD) {
				// Reset requestCount if cooldown period has passed
				const rateLimit = await RateLimit.findOneAndDelete({ userId });
				await rateLimit.save();
			} else {
				rateLimit.requestCount += 1;
			}

			rateLimit.lastRequestTime = now;

			await rateLimit.save();
			await user.save();
		}

		if (!user) {
			return NextResponse.json(
				{ message: "No user was found with the id" },
				{ status: 404 }
			);
		}

		user.onetimeVerificationCode = generateVerificationCode();
		user.verificationCodeSentAt = now;
		await user.save();

		console.log(`verification token: ${user.onetimeVerificationCode}`);
		//!send verification through email

		return NextResponse.json(
			{ message: "A new verification code has been sent!" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error requesting OTP " + error },
			{ status: 500 }
		);
	}
};
