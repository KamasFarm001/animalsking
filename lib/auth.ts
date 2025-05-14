import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendEmail } from "./resend";


export const auth = betterAuth({
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
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url, token }) => {
			await sendEmail({
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email ${url}`,
				token,
			});

			// if (!result.success) {
			// 	console.error("Failed to send verification email:", result.error);
			// 	throw new Error("Email could not be sent.");
			// }
		},
	},

	//
});
