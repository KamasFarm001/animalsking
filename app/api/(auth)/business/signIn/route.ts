import connectDb from "@/lib/db";
import Business from "@/models/business";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	try {
		const { email } = await request.json();
		if (!email) {
			return NextResponse.json(
				{ message: "email was not provided" },
				{ status: 400 }
			);
		}

		await connectDb();
		const business = await Business.findOne({ ownerEmail: email });
		if (!business) {
			return NextResponse.json(
				{ message: "There is no account with that email" },
				{ status: 400 }
			);
		}

		// update oneTimeVerification code and send code
		business.onetimeVerificationCode = generateVerificationCode();
		business.verificationCodeSentAt = new Date().getTime();

		await business.save();

		console.log(`verification code: ${business.onetimeVerificationCode}`);
		//!send verification through email

		return NextResponse.json(
			{
				message: "A verification code has been sent",
				businessId: business._id,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error Signing in business " + error },
			{ status: 500 }
		);
	}
};
