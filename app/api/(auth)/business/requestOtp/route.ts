import connectDb from "@/lib/db";
import Business from "@/models/business";
import RateLimit from "@/models/rateLimit";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const COOLDOWN_PERIOD = 2 * 60 * 1000; // 2 minutes in milliseconds
const MAX_REQUESTS = 2; // Maximum number of requests before cooldown

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const businessId = searchParams.get("businessId");

	if (!businessId || !Types.ObjectId.isValid(businessId)) {
		return NextResponse.json(
			{ message: "Invalid businessId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		// Check rate limit
		let rateLimit = await RateLimit.findOne({ businessId });
		const now = new Date();

		if (!rateLimit) {
			await RateLimit.create({ businessId, lastRequestTime: now });
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
				rateLimit.requestCount = 1;
			} else {
				rateLimit.requestCount += 1;
			}

			rateLimit.lastRequestTime = now;
			await rateLimit.save();
		}

		const business = await Business.findOne({ _id: businessId });
		if (!business) {
			return NextResponse.json(
				{ message: "No business was found with the id" },
				{ status: 404 }
			);
		}
		business.onetimeVerificationCode = generateVerificationCode();
		await business.save();

		console.log(`verification token: ${business.onetimeVerificationCode}`);
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
