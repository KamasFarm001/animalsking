import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const { pathname } = new URL(req.url);
		if (
			req.nextauth.token?.accountType !== "admin" &&
			pathname.startsWith("/api/admin/")
		) {
			return new NextResponse(
				JSON.stringify({ message: "Unauthorized access" }),
				{ status: 401 }
			);
		}
		if (
			req.nextauth.token?.accountType !== "admin" &&
			pathname.startsWith("/admin-dashboard")
		) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		} else if (
			req.nextauth.token?.accountType === "admin" &&
			pathname.startsWith("/dashboard")
		) {
			return NextResponse.redirect(new URL("/admin-dashboard", req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		pages: {
			signIn: "/signin",
			signOut: "/signin",
			error: "/signin",
			newUser: "/signup",
		},
	}
);

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|/*|favicon.ico).*)",
		"/dashboard",
		"/admin-dashboard",
		"/api/admin/:path*",
	],
};
