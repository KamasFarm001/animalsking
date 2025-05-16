import { createAuthClient } from "better-auth/react";
import {
	emailOTPClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],

	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: process.env.NEXT_PUBLIC_WEBSITE_URL,
});

export const { signIn, signUp, useSession } = createAuthClient();
