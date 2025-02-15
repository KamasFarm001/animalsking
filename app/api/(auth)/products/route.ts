import connectDb from "@/lib/db";
import Product from "@/models/product";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");

	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json({ message: "invalid userId" }, { status: 400 });
	}

	try {
		await connectDb();
		const product = await Product.find({ owner: userId });
		return NextResponse.json({ message: product }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to get products " + error },
			{ status: 500 }
		);
	}
};

export const POST = async (request: Request) => {
	const body = await request.json();
	try {
		const { productName, img, desc, ownerEmail, category, phone } = body;
		const requiredProperties = {
			productName,
			img,
			desc,
			ownerEmail,
			category,
			phone,
		};

		const missingFields = Object.entries(requiredProperties)
			.filter(([_, value]) => !value)
			.map(([key]) => key);

		if (missingFields.length > 0) {
			return NextResponse.json(
				{ message: `Missing required fields: ${missingFields.join(", ")}` },
				{ status: 400 }
			);
		}
		await connectDb();
		const userCreatingProduct = await User.findOne({
			$or: [{ email: ownerEmail }, { phone }],
		});

		const existingProduct = await Product.findOne({
			productName,
			owner: userCreatingProduct?._id,
			category,
		});

		if (existingProduct) {
			return NextResponse.json(
				{
					message: "You already have that product created.",
				},
				{ status: 400 }
			);
		}

		if (!userCreatingProduct) {
			return NextResponse.json(
				{
					message: "Could not find the user creating the product",
				},
				{ status: 404 }
			);
		}

		const newProduct = new Product({
			productName,
			img,
			desc,
			ownerEmail,
			category,
			phone,
			owner: userCreatingProduct?._id,
		});

		await newProduct.save();
		if (!newProduct) {
			return NextResponse.json(
				{ message: "An error occurred creating product" },
				{ status: 400 }
			);
		}
		return NextResponse.json({
			message: productName + " has successfully been created.",
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Error creating product " + error },
			{ status: 500 }
		);
	}
};
