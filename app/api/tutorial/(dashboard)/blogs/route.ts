import { Types } from "mongoose";
import connect from "@/app/api/tutorial/db";
import { NextResponse } from "next/server";
import Blogs from "@/app/api/tutorial/models/blogs";

export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const categoryId = searchParams.get("categoryId");
		const userId = searchParams.get("userId");
		const searchedKeywords = searchParams.get("keywords");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return NextResponse.json({
				message: "invalid categoryId or was not provided",
			});
		}
		if (!userId || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json({
				message: "invalid userId or was not provided",
			});
		}
		await connect();

		const findUser = "";
		if (!findUser) {
			return NextResponse.json(
				{ message: "No user with that id was found" },
				{ status: 404 }
			);
		}

		const filter = {
			userId,
			categoryId,
			createdAt: {},
			$or: [{}],
		};

		if (searchedKeywords) {
			filter.$or = [
				{
					title: { $regex: searchedKeywords, $options: "i" },
				},
				{
					description: { $regex: searchedKeywords, $options: "i" },
				},
			];
		}

		if (startDate && endDate) {
			filter.createdAt = {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			};
		} else if (startDate) {
			filter.createdAt = {
				$gte: new Date(startDate),
			};
		} else if (endDate) {
			filter.createdAt = {
				$lte: new Date(endDate),
			};
		}

		const skip = (page - 1) * limit;

		//TODO
		const blogs = await Blogs.find(filter)
			.sort({ createdAt: "asc" })
			.skip(skip)
			.limit(limit);

		return NextResponse.json({ blogs }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: "An error occurred getting blogs " + error },
			{ status: 500 }
		);
	}
};

export const POST = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const categoryId = searchParams.get("categoryId");
	const userId = searchParams.get("userId");
	try {
		const body = await request.json();
		const { title, description } = body;

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return NextResponse.json({
				message: "invalid categoryId or was not provided",
			});
		}
		if (!userId || !Types.ObjectId.isValid(userId)) {
			return NextResponse.json({
				message: "invalid userId or was not provided",
			});
		}
		if (!description || !title) {
			return NextResponse.json({
				message: "description of title was not provided",
			});
		}
		await connect();
		const newBlog = new Blogs({
			title,
			description,
			userId,
			categoryId,
		});

		await newBlog.save();
		if (!newBlog) {
			return NextResponse.json(
				{ message: "Error creating blog" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "Blog has been successfully created", newBlog },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "An error occurred creating blog" + error },
			{ status: 500 }
		);
	}
};
