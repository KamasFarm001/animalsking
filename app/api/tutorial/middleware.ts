import { NextResponse } from "next/server";
import { authMiddleWare } from "./middlewares/api/authMiddleware";

export default function middleware(request: Request) {
	const authResult = authMiddleWare(request);
	if (!authResult?.isValid && request.url.includes("/api/blogs")) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.next();
}

export const config = {
	matcher: "/api/:path*",
};
