import axios from "axios";
import { axiosInstance } from "./axios";

export const sendEmail = async (props: {
	to: string;
	subject: string;
	text: string;
	link: string;
	token: string;
}) => {
	try {
		const response = await axiosInstance.post("/api/send", { ...props });
		if (response.status === 200) {
			return { success: true };
		} else {
			return { success: false, error: "Something went wrong" };
		}
	} catch (error: any) {
		console.error("sendEmail error:", error.message);
		return { success: false, error: error.message };
	}
};
