"use server";

import {
	oneTimeTokenSchema,
	signInSchema,
	signUpBusinessSchema,
	signUpUserSchema,
} from "@/lib/zodSchema";
import apiConfig from "@/utils/axiosConfig";

export const signInUser = async (formData: FormData) => {
	const email = formData.get("email");
	const safePassed = signInSchema.safeParse({ email });
	if (safePassed.error) {
		return JSON.stringify({ success: false, data: safePassed.error.format() });
	}

	try {
		const response = await apiConfig.post("/api/users/signIn", {
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
	const { email, username, phone, country } = Object.fromEntries(formData);
	const safeParsed = signUpUserSchema.safeParse({
		email,
		username,
		phone,
		country,
	});

	if (safeParsed.error) {
		return JSON.stringify({ success: false, data: safeParsed.error.format() });
	}
	try {
		const response = await apiConfig.post("/api/users", {
			email,
			username,
			phone,
			country,
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
	} catch (error) {
		return JSON.stringify({ success: false, data: error });
	}
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
	const businessId = formData.get("businessId");

	const safePassed = oneTimeTokenSchema.safeParse({ oneTimeToken: otp });

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
	const otp = formData.get("otp");
	const userId = formData.get("userId");

	const safePassed = oneTimeTokenSchema.safeParse({ oneTimeToken: otp });

	if (safePassed.error) {
		return JSON.stringify({ success: false, data: safePassed.error.format() });
	}
	try {
		const response = await apiConfig.post(
			`/api/users/verify?userId=${userId}`,
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
