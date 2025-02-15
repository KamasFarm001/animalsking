import connectDb from "@/lib/db";
import Business from "@/models/business";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (
	request: Request,
	context: { params: { businessId: string } }
) => {
	const body = await request.json();
	const { businessName, phone, country, ownerEmail } = body;
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "Invalid userId or was not provided" },
			{ status: 400 }
		);
	}

	const dataToBeUpdated: {
		businessName?: string;
		phone?: string;
		country?: string;
		ownerEmail?: string;
	} = { businessName, phone, country, ownerEmail };

	const processedFields = Object.keys(dataToBeUpdated)
		.filter(
			(key) => dataToBeUpdated[key as keyof typeof dataToBeUpdated] != null
		)
		.reduce((acc: typeof dataToBeUpdated, key: string) => {
			acc[key as keyof typeof dataToBeUpdated] =
				dataToBeUpdated[key as keyof typeof dataToBeUpdated];
			return acc;
		}, {});

	try {
		await connectDb();
		const businessUser = await User.findById(userId);

		if (!businessUser) {
			return NextResponse.json(
				{
					message: "No user was found with that userId",
				},
				{ status: 200 }
			);
		}
		const businessId = context.params.businessId;
		if (!businessId || !Types.ObjectId.isValid(businessId)) {
			return NextResponse.json(
				{ message: "invalid businessId" },
				{ status: 400 }
			);
		}

		const business = await Business.findOne({ _id: businessId, owner: userId });

		if (!business) {
			return NextResponse.json(
				{ message: "You are not the owner of this business." },
				{ status: 400 }
			);
		}
		const businessAccount = await Business.findByIdAndUpdate(
			{ _id: businessId },
			{ ...processedFields },
			{ new: true }
		);

		if (!businessAccount) {
			return NextResponse.json(
				{ message: "Error updating business account" },
				{ status: 400 }
			);
		}

		const availableFields = Object.keys(processedFields);
		if (availableFields.length == 0) {
			return NextResponse.json(
				{ message: "No field was provided or is invalid to be updated" },
				{ status: 400 }
			);
		}

		if (availableFields.length >= 2) {
			const firstData = availableFields.slice(0, availableFields.length - 1);
			const lastData = availableFields[availableFields.length - 1];

			return NextResponse.json(
				{
					message: `${
						firstData.join(", ") + " and " + lastData
					} has been updated`,
				},
				{ status: 200 }
			);
		}
		return NextResponse.json(
			{
				message: `${Object.keys(processedFields).join(", ")} has been updated`,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "An error occurred updating business account " + error },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	request: Request,
	context: { params: { businessId: string } }
) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const businessId = context.params.businessId;

	if (!businessId || !Types.ObjectId.isValid(businessId)) {
		return NextResponse.json(
			{ message: "invalid businessId or was not provided" },
			{ status: 400 }
		);
	}
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "invalid userId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connectDb();
		const businessExistToUser = await Business.findOne({
			_id: businessId,
			owner: userId,
		});
		if (!businessExistToUser) {
			return NextResponse.json(
				{ message: "You are not the owner of this business" },
				{ status: 400 }
			);
		}

		//remove business Id from user Businesses
		const businessUser = await User.findById(userId);
		if (!businessUser) {
			return NextResponse.json(
				{ message: "No user was found" },
				{ status: 400 }
			);
		}

		const updatedUserBusinesses = businessUser.businesses.filter(
			(businesses: string) => businesses.toString() !== businessId.toString()
		);

		businessUser.businesses = updatedUserBusinesses;

		const deletedBusiness = await Business.findOneAndDelete({
			_id: businessId,
		});
		if (!deletedBusiness) {
			return NextResponse.json(
				{ message: "Could not delete the business Account" },
				{ status: 400 }
			);
		}

		await businessUser.save();

		return NextResponse.json(
			{
				message: "Business Account has been deleted",
				business: { businessName: businessExistToUser.businessName },
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error deleting business account " + error },
			{ status: 500 }
		);
	}
};
