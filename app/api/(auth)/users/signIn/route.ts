import connectDb from "@/lib/db";
import User from "@/models/user";
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
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "There is no account with that email" },
				{ status: 400 }
			);
		}

		// update oneTimeVerification code and send code
		user.onetimeVerificationCode = generateVerificationCode();
		user.verificationCodeSentAt = new Date().getTime();
		await user.save();

		console.log(`verification code: ${user.onetimeVerificationCode}`);
		//!send verification through email

		return NextResponse.json(
			{ message: "A verification code has been sent", userId: user._id },
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error Signing in user " + error },
			{ status: 500 }
		);
	}
};
