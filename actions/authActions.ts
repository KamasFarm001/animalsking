"use server";

import { authClient } from "@/lib/auth-client";
import {
	oneTimeTokenSchema,
	signInSchema,
	signUpBusinessSchema,
	signUpUserSchema,
} from "@/lib/zodSchema";
import apiConfig from "@/utils/axiosConfig";
import { redirect } from "next/navigation";

export const signInUser = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const safePassed = signInSchema.safeParse({ email, password });
	if (safePassed.error) {
		return JSON.stringify({ success: false, data: safePassed.error.format() });
	}

	try {
		const { data, error } = await authClient.signIn.email({
			email: email!,
			password: password!,
			rememberMe: false,
		});

		if (error?.message) {
			return JSON.stringify({
				success: false,
				data: error,
			});
		}
		return JSON.stringify({
			success: true,
			data: `Welcome ${data?.user.name}`,
		});
	} catch (error: any) {
		return JSON.stringify({ success: false, data: error });
	}
};
export const signInBusiness = async (formData: FormData) => {
	const email = formData.get("email");
	const safePassed = signInSchema.safeParse({ email });
	if (safePassed.error) {
		return JSON.stringify({ success: false, data: safePassed.error.format() });
	}

	try {
		const response = await apiConfig.post("/api/business/signIn", {
			email,
		});

		if (response.status === 200) {
			console.log(response.data);
			return JSON.stringify({ success: true, data: response.data });
		}
		console.log(response.data);
		return JSON.stringify({
			success: false,
			data: response.data.message,
		});
	} catch (error: any) {
		return JSON.stringify({ success: false, data: error });
	}
};

export const signUpUser = async (formData: FormData) => {
	const { email, username, password, country } = Object.fromEntries(formData);
	const safeParsed = signUpUserSchema.safeParse({
		email,
		username,
		password,
		country,
	});

	if (safeParsed.error) {
		return JSON.stringify({ success: false, data: safeParsed.error.format() });
	}

	const { error } = await authClient.signUp.email({
		email: safeParsed.data.email,
		password: safeParsed.data.password,
		name: safeParsed.data.username,
		country: safeParsed.data.country,
	});

	if (error?.message) {
		console.log(error);
		return JSON.stringify({ success: false, data: error.message });
	}
	return JSON.stringify({
		success: true,
		data: "Your account has been created",
	});
};

export const signUpBusiness = async (formData: FormData) => {
	const { email, businessName, phone, country, accountType } =
		Object.fromEntries(formData);

	const safeParsed = signUpBusinessSchema.safeParse({
		email,
		businessName,
		phone,
		country,
		accountType,
	});

	if (safeParsed.error) {
		return JSON.stringify({ success: false, data: safeParsed.error.format() });
	}

	try {
		const response = await apiConfig.post("/api/business", {
			ownerEmail: email,
			businessName,
			phone,
			country,
			accountType,
		});
		if (response.status === 201) {
			return JSON.stringify({ success: true, data: response.data });
		} else {
			return JSON.stringify({
				success: false,
				data: response.data.message,
			});
		}
	} catch (error) {
		return JSON.stringify({ success: false, data: error });
	}
};

export const verifyBusinessOneTimeToken = async (formData: FormData) => {
	const otp = formData.get("otp");
	const email = formData.get("email");
	const businessId = formData.get("businessId");

	const safePassed = oneTimeTokenSchema.safeParse({ oneTimeToken: otp, email });

	if (safePassed.error) {
		return JSON.stringify({ success: false, data: safePassed.error.format() });
	}
	try {
		const response = await apiConfig.post(
			`/api/business/verify?businessId=${businessId}`,
			{
				otp,
			}
		);

		if (response.status === 200) {
			console.log(response.data);
			return JSON.stringify({ success: true, data: response.data });
		}
		console.log(response.data);
		return JSON.stringify({
			success: false,
			data: response.data.message,
			email: response.data.email,
		});
	} catch (error) {
		return JSON.stringify({ success: false, data: error });
	}
};
export const verifyOneTimeToken = async (formData: FormData) => {
	const otp = formData.get("otp") as string;
	const email = formData.get("email") as string;
	const safePassed = oneTimeTokenSchema.safeParse({ oneTimeToken: otp });

	if (safePassed.error) {
		return JSON.stringify({ success: false, data: safePassed.error.format() });
	}
	try {
		const { data, error } = await authClient.signIn.emailOtp({
			email: email!,
			otp: otp!,
		});

		if (error) {
			return JSON.stringify({
				success: false,
				data: error,
				email: email!,
			});
		}
		return JSON.stringify({ success: true, data: "Verification success" });
	} catch (error) {
		return JSON.stringify({ success: false, data: error });
	}
};
