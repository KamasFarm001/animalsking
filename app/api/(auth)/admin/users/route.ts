import connectDb from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
	const session = await getServerSession();
	if (!session || !session.user) {
		return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
	}

	if (session.user.accountType !== "admin") {
		return NextResponse.json(
			{ message: "Unauthorized Access" },
			{ status: 401 }
		);
	}
	try {
		await connectDb();
		const users = await User.find();
		return NextResponse.json({ users }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error fetching users" + error },
			{ status: 500 }
		);
	}
};
