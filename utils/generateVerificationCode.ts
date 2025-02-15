import Business from "@/models/business";
import User from "@/models/user";

export const generateVerificationCode = (): string => {
	const uintArray = new Uint8Array(6);
	const randomData = crypto.getRandomValues(uintArray);
	const otp = Array.from(randomData)
		.map((number) => number % 10)
		.join("")
		.slice(0, 6);

	return otp;
};

type VerifyExpiry =
	| { userId: string; model: "user" }
	| { businessId: string; model: "business" };

export const isVerificationCodeExpired = async (props: VerifyExpiry) => {
	try {
		if (props.model === "user") {
			const user = await User.findById(props.userId);
			if (!user) {
				return true;
			}
			const expiryDuration = 1 * 60 * 60 * 1000; //1 hour in milliseconds
			const now = Date.now();
			const timeDifference = now - user.verificationCodeSentAt;

			return timeDifference > expiryDuration;
		}

		if (props.model === "business") {
			const business = await Business.findById(props.businessId);
			if (!business) {
				return true;
			}
			const expiryDuration = 1 * 60 * 60 * 1000; //1 hour in milliseconds
			const now = Date.now();
			const timeDifference = now - business.verificationCodeSentAt;

			return timeDifference > expiryDuration;
		}
	} catch (error) {
		console.log(error);
		return true;
	}
};
