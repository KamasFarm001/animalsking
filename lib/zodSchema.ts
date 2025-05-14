import { string, z } from "zod";

export const signInSchema = z.object({
	email: z.string().email(),
});

export const oneTimeTokenSchema = z.object({
	oneTimeToken: z.string().min(6, {
		message: "Your one-time code must be 6 characters.",
	}),
});

export const signUpBusinessSchema = z.object({
	email: string().email(),
	businessName: string({ required_error: "business name is required" }).min(5),
	phone: string({ required_error: "phone is required" }).min(10),
	country: z.enum(["Ghana", "Nigeria"]),
	accountType: z.enum(["partner", "merchant"], {
		required_error: "Account type is required",
	}),
});

export const signUpUserSchema = z.object({
	email: string().email(),
	username: string({ required_error: "username is required" }).min(5),
	country: z.enum(["Ghana", "Nigeria"]),
	password: z
		.string({ required_error: "Password is required" })
		.min(8, { message: "Password must be at least 8 characters long" }),
});

export const postSchema = z.object({
	postText: string({ required_error: "A post content is required" }),
});
