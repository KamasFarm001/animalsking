import { DefaultUser, DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username?: string;
			accountType: "personal" | "partner" | "merchant" | "admin";
			hasVerifiedAccount: boolean;
			phone: string;
			email: string;
			businessName?: string;
			owner?: string;
			country: string;
			avatarUrl: string;
			displayName: string;
		} & DefaultSession;
	}

	export interface User extends DefaultUser {
		id: string;
		username: string;
		accountType: "personal" | "partner" | "merchant" | "admin";
		hasVerifiedAccount: boolean;
		phone: string;
		email: string;
		owner?: string;
		businessName?: string;
		country: string;
		avatarUrl: string;
		displayName: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		id: string;
		username?: string;
		accountType: "personal" | "partner" | "merchant" | "admin";
		hasVerifiedAccount: boolean;
		phone: string;
		email: string;
		owner?: string;
		businessName?: string;
		country: string;
		avatarUrl: string;
		displayName: string;
	}
}
