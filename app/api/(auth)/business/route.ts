import connectDb from "@/lib/db";
import Business from "@/models/business";
import User from "@/models/user";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		const businessAccounts = await Business.find({ owner: userId });
		return NextResponse.json({ message: businessAccounts }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Error finding business Accounts " + error },
			{ status: 500 }
		);
	}
};

export const POST = async (request: Request) => {
	const body = await request.json();
	const { businessName, ownerEmail, phone, country, accountType } = body;

	const requiredFields = {
		businessName,
		ownerEmail,
		phone,
		country,
		accountType,
	};

	const missingFields = Object.entries(requiredFields)
		.filter(([_, value]) => !value)
		.map(([key]) => key);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{ message: `Missing required fields: ${missingFields.join(", ")}` },
			{ status: 400 }
		);
	}
	try {
		await connectDb();

		const existingBusiness = await Business.findOne({
			ownerEmail,
			phone,
			businessName,
		});

		if (existingBusiness) {
			return NextResponse.json(
				{
					message: "This business Account already exists",
				},
				{ status: 400 }
			);
		}
		const userSigningUpForBusiness = await User.findOne({
			email: ownerEmail,
			phone,
		});

		if (!userSigningUpForBusiness) {
			const newBusiness = new Business({
				businessName,
				ownerEmail,
				phone,
				country,
				owner: "",
				accountType,
				verificationCodeSentAt: new Date().getTime(),
				onetimeVerificationCode: generateVerificationCode(),
			});
			await newBusiness.save();

			console.log(
				`verification code: ${newBusiness.onetimeVerificationCode} line 85`
			);
			//!send verification through email
			return NextResponse.json(
				{
					message: "Your business has been registered!",
					businessId: newBusiness._id,
				},
				{ status: 201 }
			);
		}
		//update user business if user exists
		const newBusinessForExistingUser = new Business({
			businessName,
			ownerEmail,
			phone,
			country,
			accountType,
			owner: userSigningUpForBusiness?._id,
			verificationCodeSentAt: new Date().getTime(),
			onetimeVerificationCode: generateVerificationCode(),
		});

		userSigningUpForBusiness.businesses.push(newBusinessForExistingUser._id);
		await newBusinessForExistingUser.save();
		await userSigningUpForBusiness.save(); //update the user with new business created

		console.log(
			`verification code: ${newBusinessForExistingUser.onetimeVerificationCode}`
		);
		//!send verification through email

		return NextResponse.json(
			{
				message: "Your business has been registered!",
				businessId: newBusinessForExistingUser._id,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.log(error);
		if (error.code === 11000) {
			return NextResponse.json(
				{ message: "This business Account already exists" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "Error creating business account " + error },
			{ status: 500 }
		);
	}
};
