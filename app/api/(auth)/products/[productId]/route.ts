import connectDb from "@/lib/db";
import Product from "@/models/product";
import User from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (
	request: Request,
	context: { params: { productId: string } }
) => {
	const productId = context.params.productId;
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const body = await request.json();
	const { productName, img, desc, owner, phone, ownerEmail, category } = body;

	const dataToBeUpdated: {
		productName?: string;
		img?: string;
		desc?: string;
		owner?: string;
		phone?: string;
		ownerEmail?: string;
		category?: string;
	} = { productName, img, desc, owner, phone, ownerEmail, category };

	const processedFields = Object.keys(dataToBeUpdated)
		.filter(
			(key) => dataToBeUpdated[key as keyof typeof dataToBeUpdated] != null
		)
		.reduce((acc: typeof dataToBeUpdated, key: string) => {
			acc[key as keyof typeof dataToBeUpdated] =
				dataToBeUpdated[key as keyof typeof dataToBeUpdated];
			return acc;
		}, {});

	if (!productId || !Types.ObjectId.isValid(productId)) {
		return NextResponse.json(
			{ message: "invalid productId or was not provided" },
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
		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ message: "No user was found with that id" },
				{ status: 400 }
			);
		}

		const availableFields = Object.keys(processedFields);
		if (availableFields.length <= 0) {
			return NextResponse.json(
				{ message: "No field was provided to be updated" },
				{ status: 400 }
			);
		}

		const productExistToUser = await Product.findOne({
			_id: productId,
			owner: userId,
		});
		if (!productExistToUser) {
			return NextResponse.json(
				{ message: "You are not the owner of this product" },
				{ status: 400 }
			);
		}

		const product = await Product.findByIdAndUpdate(
			{ _id: productId },
			{ ...processedFields },
			{ new: true }
		);

		if (!product) {
			return NextResponse.json({ message: "Could not update product" });
		}

		return NextResponse.json(
			{
				message: `${availableFields.join(", ")} has been updated`,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error updating product " + error },
			{ status: 500 }
		);
	}
};

export const DELETE = async (
	req: Request,
	context: { params: { productId: string } }
) => {
	const productId = context.params.productId;
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");

	if (!productId || !Types.ObjectId.isValid(productId)) {
		return NextResponse.json(
			{ message: "invalid productId or was not provided" },
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
		const userDeletingProduct = await User.findById(userId);
		if (!userDeletingProduct) {
			return NextResponse.json(
				{ message: "No user was found with that id" },
				{ status: 400 }
			);
		}

		const productExistToUser = await Product.findOne({
			_id: productId,
			owner: userId,
		});
		if (!productExistToUser) {
			return NextResponse.json(
				{ message: "You are not the owner of this product" },
				{ status: 400 }
			);
		}

		const productToBeDeleted = await Product.findOneAndDelete({
			_id: productId,
			owner: userId,
		});

		if (!productToBeDeleted) {
			return NextResponse.json(
				{ message: "Could not find product to be deleted" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{
				message: "product id " + productId + " has been successfully deleted",
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error deleting product " + error },
			{ status: 500 }
		);
	}
};
