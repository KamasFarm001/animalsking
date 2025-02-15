import { model, Schema, models } from "mongoose";

const businessSchema = new Schema(
	{
		businessName: { type: String, required: true },
		hasVerifiedAccount: { type: Boolean, default: false },
		phone: { type: String, required: true },
		accountType: {
			type: String,
			enum: ["partner", "merchant", "admin"],
			default: "partner",
			required: true,
		},
		country: { type: String, required: true },
		ownerEmail: { type: String, required: true },
		owner: { type: String, required: false },
		employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
		onetimeVerificationCode: { type: String, require: false },
		verificationCodeSentAt: { type: Date },
		followers: [{ type: Schema.Types.ObjectId, ref: "Followers" }],
		following: [{ type: Schema.Types.ObjectId, ref: "Followers" }],
	},
	{
		timestamps: true,
	}
);

const Business = models.Business || model("Business", businessSchema);
export default Business;
