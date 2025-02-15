import { oneTimeTokenSchema } from "@/lib/zodSchema";
import RateLimit from "@/models/rateLimit";
import apiConfig from "@/utils/axiosConfig";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
	providers: [
		CredentialProvider({
			type: "credentials",
			credentials: {},
			async authorize(credentials) {
				const { otp, userId } = credentials as {
					otp: string;
					userId: string;
				};
				const safePassed = oneTimeTokenSchema.safeParse({ oneTimeToken: otp });

				if (safePassed.error) {
					return JSON.stringify({
						success: false,
						data: safePassed.error.format(),
					});
				}
				try {
					const response = await apiConfig.post(
						`/api/users/verify?userId=${userId}`,
						{
							otp,
						}
					);

					if (response.status === 200) {
						await RateLimit.findOneAndDelete({
							userId: response?.data?.user?._id,
						});
						return { ...response.data.user, id: response?.data?.user?._id };
					} else {
						console.log(response);
						throw new Error(JSON.stringify(response?.data?.message));
					}
				} catch (error: any) {
					console.log(error);
					throw new Error(error);
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 * 7, // 7 days
	},

	jwt: {
		maxAge: 60 * 60 * 24 * 7, // 7 days
	},

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.username = user.username;
				token.accountType = user.accountType;
				token.hasVerifiedAccount = user.hasVerifiedAccount;
				token.phone = user.phone;
				token.country = user.country;
				token.avatarUrl = user.avatarUrl;
				token.displayName = user.displayName;
				if (user.accountType === "partner") {
					token.id = user.id;
					token.email = user.email;
					token.businessName = user.businessName;
					token.accountType = user.accountType;
					token.phone = user.phone;
					token.country = user.country;
					token.hasVerifiedAccount = user.hasVerifiedAccount;
					token.avatarUrl = user.avatarUrl;
					token.displayName = user.displayName;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.email = token.email;
				session.user.id = token.id;
				session.user.username = token.username;
				session.user.accountType = token.accountType;
				session.user.hasVerifiedAccount = token.hasVerifiedAccount;
				session.user.phone = token.phone;
				session.user.country = token.country;
				session.user.avatarUrl = token.avatarUrl;
				session.user.displayName = token.displayName;

				if (session.user.accountType === "partner") {
					session.user.id = token.id;
					session.user.businessName = token.businessName;
					session.user.accountType = token.accountType;
					session.user.hasVerifiedAccount = token.hasVerifiedAccount;
					session.user.phone = token.phone;
					session.user.country = token.country;
					session.user.avatarUrl = token.avatarUrl;
					session.user.displayName = token.displayName;
				}
			}
			return session;
		},
	},

	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/signin",
		newUser: "/signup",
		signOut: "/signin",
	},
};
