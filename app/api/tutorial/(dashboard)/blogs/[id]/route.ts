import connect from "@/app/api/tutorial/db";
import Blogs from "@/app/api/tutorial/models/blogs";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
	const { searchParams } = new URL(request.url);

	const userId = searchParams.get("userId");
	const categoryId = searchParams.get("categoryId");
	const blogId = context.params.id;

	if (!blogId || !Types.ObjectId.isValid(blogId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}
	if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connect();
		const user = "";
		if (!user) {
			return NextResponse.json(
				{ message: "No user was found with that id" },
				{ status: 400 }
			);
		}

		const categories = "";
		if (!categories) {
			return NextResponse.json(
				{ message: "no categories were found" },
				{ status: 404 }
			);
		}

		const blogs = await Blogs.findOne({
			_id: blogId,
			userId,
			categoryId,
		});

		if (!blogs) {
			return NextResponse.json({ message: "blog not found" }, { status: 404 });
		}
		return NextResponse.json({ blogs }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Error getting blogs " + error },
			{ status: 500 }
		);
	}
};

export const PATCH = async (request: Request, context: { params: any }) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const blogId = context.params.id;
	const categoryId = searchParams.get("categoryId");
	const body = await request.json();
	const { title, description } = body;

	if (!title || !description) {
		return NextResponse.json(
			{ message: "title or description was not provided" },
			{ status: 400 }
		);
	}

	if (!blogId || !Types.ObjectId.isValid(blogId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}
	if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connect();
		const user = await "";
		if (!user) {
			return NextResponse.json(
				{ message: "No user was found with that id" },
				{ status: 400 }
			);
		}

		const categories = "";
		if (!categories) {
			return NextResponse.json(
				{ message: "no categories were found" },
				{ status: 404 }
			);
		}

		const blogs = await Blogs.findOne({
			_id: blogId,
			userId,
			categoryId,
		});

		if (!blogs) {
			return NextResponse.json({ message: "blog not found" }, { status: 404 });
		}

		const blog = await Blogs.findOneAndUpdate(
			{ _id: blogId },
			{ title, description },
			{ new: true }
		);

		if (!blog) {
			return NextResponse.json(
				{ message: "failed to update blog" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ blog }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Error getting blog " + error },
			{ status: 500 }
		);
	}
};

export const DELETE = async (request: Request, context: { params: any }) => {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const blogId = context.params.id;
	const categoryId = searchParams.get("categoryId");

	if (!blogId || !Types.ObjectId.isValid(blogId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}
	if (!userId || !Types.ObjectId.isValid(userId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}
	if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
		return NextResponse.json(
			{ message: "invalid categoryId or was not provided" },
			{ status: 400 }
		);
	}

	try {
		await connect();
		const user = await "";
		if (!user) {
			return NextResponse.json(
				{ message: "No user was found with that id" },
				{ status: 400 }
			);
		}

		const categories = "";
		if (!categories) {
			return NextResponse.json(
				{ message: "no categories were found" },
				{ status: 404 }
			);
		}

		const blogs = await Blogs.findOne({
			_id: blogId,
			userId,
			categoryId,
		});

		if (!blogs) {
			return NextResponse.json({ message: "blog not found" }, { status: 404 });
		}

		const deletedBlog = await Blogs.findOneAndDelete({
			_id: blogId,
			userId,
			categoryId,
		});

		if (!deletedBlog) {
			return NextResponse.json(
				{ message: "An error occurred deleting blog " + blogId },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "blog id " + blogId + "has been successfully been deleted" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error deleting blog " + error },
			{ status: 500 }
		);
	}
};
