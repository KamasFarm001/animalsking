import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendEmail } from "./resend";
import { emailOTP } from "better-auth/plugins/email-otp";

export const auth = betterAuth({
	plugins: [
		emailOTP({
			disableSignUp: true,
			async sendVerificationOTP({ email, otp, type }) {
				await sendEmail({
					to: email,
					subject: "Verify your email address",
					text: `Click the link to verify your email`,
					token: otp,
					link: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/signup/user-verification?email=${email}&otp=${otp}`,
				});
			},
		}),
	],
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
	user: {
		additionalFields: {
			country: {
				type: "string",
				required: true,
			},
		},
	},

	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
});
