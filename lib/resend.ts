import axios from "axios";

export const sendEmail = async (props: {
	to: string;
	subject: string;
	text: string;
	token: string;
}) => {
	console.log("hello");
	// try {
	// 	console.log("hello");
	// 	const response = await axios.post("/api/send", { props });
	// 	console.log(response);
	// 	if (response.status === 200) {
	// 		return { success: true };
	// 	} else {
	// 		return { success: false, error: "Something went wrong" };
	// 	}
	// } catch (error: any) {
	// 	console.error("sendEmail error:", error.message);
	// 	return { success: false, error: error.message };
	// }
};
