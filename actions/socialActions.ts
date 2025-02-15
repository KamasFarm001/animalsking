"use server";

import { postSchema } from "@/lib/zodSchema";
import apiConfig from "@/utils/axiosConfig";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { revalidateTag } from "next/cache";
import { extractHashtags } from "@/utils/utils";
const baseURL = process.env.WEBSITE_URL;

export const getPost = async ({
	postId,
	userId,
}: {
	postId: string;
	userId: string;
}) => {
	try {
		const response = await apiConfig.get(
			`${baseURL}/api/post/${postId}?userId=${userId}`
		);
		if (response.status === 200) {
			return JSON.stringify({ success: true, data: response.data });
		}
		return JSON.stringify({
			success: false,
			data: response.data.message,
		});
	} catch (error) {
		return JSON.stringify({ success: false, data: error });
	}
};

export const createPost = async (formData: FormData) => {
	const postText = formData.get("postText");
	const safeParse = postSchema.safeParse({ postText });
	const session = await getServerSession(options);

	if (safeParse.error) {
		return JSON.stringify({ success: false, data: safeParse.error.format() });
	}

	try {
		const response = await apiConfig.post(
			`${baseURL}/api/post?userId=${session?.user?.id}`,
			{
				content: postText,
			}
		);

		if (response.status === 200) {
			const hashtags = extractHashtags(postText?.toString()!);

			if (hashtags.length > 0) {
				revalidateTag("hashtags");
			}
			return JSON.stringify({ success: true, data: response.data });
		}
		return JSON.stringify({
			success: false,
			data: response.data.message,
		});
	} catch (error: any) {
		return JSON.stringify({ success: false, data: error });
	}
};

export const DeletePost = async (postId: string) => {
	const session = await getServerSession(options);

	try {
		if (!session || !session.user) {
			return JSON.stringify({
				success: false,
				data: "You are Unauthorized",
			});
		}
		const response = await apiConfig.delete(`api/post/${postId}`, {
			params: {
				userId: session.user.id,
			},
		});

		if (response.status === 200) {
			revalidateTag("hashtags");
			return JSON.stringify({ success: true, data: response.data });
		}
		return JSON.stringify({
			success: false,
			data: response.data.message,
		});
	} catch (error: any) {
		return JSON.stringify({ success: false, data: error });
	}
};
