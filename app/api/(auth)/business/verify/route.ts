import connectDb from "@/lib/db";
import Business from "@/models/business";
import RateLimit from "@/models/rateLimit";
import { isVerificationCodeExpired } from "@/utils/generateVerificationCode";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const body = await request.json();
	const { otp } = body;

	const { searchParams } = new URL(request.url);
	const businessId = searchParams.get("businessId");
	if (!businessId || !Types.ObjectId.isValid(businessId)) {
		return NextResponse.json(
			{ message: "businessId was not provided or is invalid " },

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
		const business = await Business.findOne({ _id: businessId });
		if (!business) {
			return NextResponse.json(
				{ message: "No business was found with the id" },
				{ status: 404 }
			);
		}

		const verificationExpired = await isVerificationCodeExpired({
			model: "business",
			businessId,
		});

		console.log(verificationExpired);

		if (verificationExpired) {
			business.onetimeVerificationCode = "";
			business.verificationCodeSentAt = "";
			await business.save();
			await RateLimit.findOneAndDelete({ businessId });

			return NextResponse.json(
				{ message: "Verification code expired" },
				{ status: 400 }
			);
		}

		if (business.onetimeVerificationCode !== otp) {
			return NextResponse.json(
				{ message: "Invalid verification code" },
				{ status: 400 }
			);
		}
		business.onetimeVerificationCode = "";
		business.verificationCodeSentAt = "";

		await RateLimit.findOneAndDelete({ businessId });
		await business.save();

		const {
			_id,
			email,
			businessName,
			accountType,
			hasVerifiedAccount,
			phone,
			createdAt,
			updatedAt,
			country,
			owner,
			employees,
		} = business;

		return NextResponse.json(
			{
				message: "You are authenticated!",
				business: {
					_id,
					email,
					businessName,
					accountType,
					hasVerifiedAccount,
					phone,
					createdAt,
					updatedAt,
					country,
					owner,
					employees,
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
