import { Schema, model, models } from "mongoose";

const rateLimitSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	businessId: {
		type: Schema.Types.ObjectId,
		ref: "Business",
	},

	lastRequestTime: { type: Date, default: Date.now },
	requestCount: { type: Number, default: 0 },
	resetTime: { type: Date, default: Date.now },
});

const RateLimit = models?.RateLimit || model("RateLimit", rateLimitSchema);
export default RateLimit;
