import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		username: { type: String },
		avatarUrl: { type: String, default: "" },
		displayName: { type: String, default: "" },
		accountType: { type: String, default: "personal" },
		hasVerifiedAccount: { type: Boolean, default: false },
		onetimeVerificationCode: { type: String },
		verificationCodeSentAt: { type: Date },
		phone: { type: String, required: true },
		country: { type: String, required: false },
		businesses: [{ type: Schema.Types.ObjectId, ref: "Business" }],
		followers: [
			{ type: Schema.Types.ObjectId, ref: "Followers", unique: true },
		],
		following: [
			{ type: Schema.Types.ObjectId, ref: "Followers", unique: true },
		],

		bio: { type: String, required: false },
	},
	{
		timestamps: true,
	}
);

const User = models.User || model("User", UserSchema);
export default User;
